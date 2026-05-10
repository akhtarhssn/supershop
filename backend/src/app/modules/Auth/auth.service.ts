import bcrypt from 'bcrypt';
import crypto from 'crypto';
import httpStatus from 'http-status';
import { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

import config from '../../config';
import { AppError } from '../../errors/AppError';
import { sendMail, sendVerificationEmail } from '../../utils/sendMail';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface';
import { CreateToken, verifyToken } from './auth.utils';

const loginUser = async (payload: ILoginUser) => {
  // check if the user exists
  // const isUserExist = await User.findOne({ id: payload?.id });
  const isUserExist = await User.userExists(payload?.email);

  const isDeleted = isUserExist?.isDeleted;
  const status = isUserExist?.status;

  if (!isUserExist || isDeleted === true || status === 'Blocked') {
    throw new AppError(
      !isUserExist ? httpStatus.NOT_FOUND : httpStatus.FORBIDDEN,
      `${
        (!isUserExist && 'User not found !') ||
        (isDeleted &&
          'You were deleted by admin. Contact admin for further help !!!') ||
        'You are blocked by admin. Contact admin for further help !!!'
      }`,
    );
  }

  // throw error if password not matches:
  if (!payload?.password || !isUserExist?.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is undefined');
  }
  const isPasswordMatch = await User.isPasswordMatch(
    payload?.password,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match");
  }

  const userId = isUserExist._id?.toString() as string;

  // create token and sent to the client
  const jwtPayload = {
    userId,
    role: isUserExist?.role,
  };
  const accessToken = CreateToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires as SignOptions['expiresIn'],
  );

  const refreshToken = CreateToken(
    jwtPayload,
    config.jwt_refresh_secret as Secret,
    config.jwt_refresh_expires as SignOptions['expiresIn'],
  );

  // Access Granted: Send AccessToken, RefreshToken
  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExist?.needPasswordChange,
  };
};

const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // is password match
  const isUserExist = await User.userExists(user?.userId);

  const isDeleted = isUserExist?.isDeleted;
  const status = isUserExist?.status;

  if (!isUserExist || isDeleted === true || status === 'Blocked') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `${
        (!isUserExist && 'User not found !') ||
        (isDeleted && 'This user is deleted !!!') ||
        'The user is blocked !!!'
      }`,
    );
  }

  // throw error if password not matches:
  if (!payload?.oldPassword || !isUserExist?.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password is undefined');
  }
  // check if password match
  const isPasswordMatch = await User.isPasswordMatch(
    payload?.oldPassword,
    isUserExist?.password,
  );

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, "Password doesn't match");
  }

  // hash the new password before updating
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: user.userId,
      role: user.role,
    },
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // validation
  // checking if the given token is valid | verify the received token
  const decoded = verifyToken(token, config.jwt_refresh_secret as Secret);

  const { userId, iat } = decoded;
  // user existence check:
  const isUserExist = await User.userExists(userId);

  const isDeleted = isUserExist?.isDeleted;
  const status = isUserExist?.status;

  if (!isUserExist || isDeleted === true || status === 'Blocked') {
    throw new AppError(
      !isUserExist ? httpStatus.NOT_FOUND : httpStatus.FORBIDDEN,
      `${
        (!isUserExist && 'User not found !') ||
        (isDeleted && 'This user is deleted !!!') ||
        'The user is blocked !!!'
      }`,
    );
  }

  // check if token issued expired:
  if (
    isUserExist.passwordChangedAt &&
    User.JwtIssueBeforePassChange(isUserExist.passwordChangedAt, iat as number)
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Login with your new password!!',
    );
  }

  // create access token:
  // create token and sent to the client
  const jwtPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };
  const accessToken = CreateToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires as SignOptions['expiresIn'],
  );

  return { accessToken };
};

const forgetPassword = async (userId: string) => {
  // verify user before forget password
  const user = await User.userExists(userId);

  if (!user || user.isDeleted || user.status === 'Blocked') {
    // throw new AppError(
    //   !user ? httpStatus.NOT_FOUND : httpStatus.FORBIDDEN,
    //   `${
    //     (!user && 'User not found !') ||
    //     (user?.isDeleted && 'This user is deleted !!!') ||
    //     'The user is blocked !!!'
    //   }`,
    // );
    throw new AppError(
      httpStatus.NOT_FOUND,
      `If a user with id: ${userId} exists, a reset link would have been sent.`,
    );
  }

  // Bump version → invalidates ALL previous reset tokens
  await User.findOneAndUpdate(
    { id: user.id },
    {
      $inc: { passwordResetVersion: 1 },
    },
  );

  // Re-fetch to get updated version (or calculate it)
  const updatedUser = await User.findOneAndUpdate({ id: user.id }).select(
    'passwordResetVersion id role email',
  );

  // create token and sent to the client
  const jwtPayload = {
    userId: updatedUser?.id,
    role: updatedUser?.role as string,
    resetVersion: (updatedUser!.passwordResetVersion ?? 0) + 1, // use the new value
  };

  const resetToken = CreateToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    '10m',
  );

  const resetUILink = `http://localhost:3000?id=${updatedUser?.id}&token=${resetToken}`;
  // console.log({ resetToken });

  sendMail(updatedUser!.email, {
    userName: updatedUser?.email.split('@')[0],
    resetLink: resetUILink,
  });
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the given token is valid | verify the received token
  const decoded = verifyToken(token, config.jwt_access_secret as Secret);

  // Throw error if payload id and token id doesn't match
  if (payload?.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Access forbidden');
  }

  // verify user before forget password
  const user = await User.findOne({ id: payload?.id }).select(
    '+passwordResetVersion',
  );

  if (!user || user.isDeleted || user.status === 'Blocked') {
    // throw new AppError(
    //   !user ? httpStatus.NOT_FOUND : httpStatus.FORBIDDEN,
    //   `${
    //     (!user && 'User not found !') ||
    //     (user?.isDeleted && 'This user is deleted !!!') ||
    //     'The user is blocked !!!'
    //   }`,
    // );
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid or expired reset link');
  }

  // console.log('Decoded Reset Version', decoded.resetVersion);

  // critical check
  if (decoded.resetVersion - 1 !== user.passwordResetVersion) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This reset link is no longer valid. Please request a new one.',
    );
  }

  // hash the new password before updating
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  // DONE: double check if multiple reset token is generated for the same user within 10 minutes, if yes then invalidate the previous token and throw error if the previous token is used, and tell the user to use the latest token for password reset, and also invalidate the token after successful password reset

  // Update password
  await User.findOneAndUpdate(
    { id: decoded.userId, role: decoded.role },
    {
      password: newHashedPassword,
      needPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  // Optional: bump version again (prevents any race-condition tokens)
  await User.findOneAndUpdate(
    { id: user.id },
    {
      $inc: { passwordResetVersion: 1 },
    },
  );
};

const verifyEmail = async (token: string) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid or expired verification token. Please request a new one.',
    );
  }

  await User.findByIdAndUpdate(user._id, {
    isEmailVerified: true,
    $unset: { emailVerificationToken: '', emailVerificationExpires: '' },
  });

  return { message: 'Email verified successfully!' };
};

const resendVerificationEmail = async (userId: string) => {
  const user = await User.findOne({ id: userId });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  if (user.isEmailVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email is already verified.');
  }

  // Generate a fresh token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await User.findByIdAndUpdate(user._id, {
    emailVerificationToken: verificationToken,
    emailVerificationExpires: expires,
  });

  const frontendUrl = config.frontend_url || 'http://localhost:3000';
  const verifyLink = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

  await sendVerificationEmail(user.email, {
    userName: user.name,
    verifyLink,
  });

  return { message: 'Verification email sent successfully.' };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};

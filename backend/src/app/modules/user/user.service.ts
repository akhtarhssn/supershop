/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { IUser } from './user.interface';
import { User } from './user.model';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../utils/sendMail';

const createUserIntoDB = async (password: string, payload: Partial<IUser>) => {
  const userData: Partial<IUser> = { ...payload };

  // if not password use default password
  userData.password = password || (config.default_password as string);

  // Set default role if not provided
  if (!userData.role) {
    userData.role = 'buyer';
  }

  // Set custom ID (e.g., U-0001) or just use email.
  // For this implementation, we'll use a simple incrementing ID for consistency with user's "organized way"
  const lastUser = await User.findOne({}, { id: 1 }).sort({ createdAt: -1 });
  let nextId = 'U-0001';
  if (lastUser && lastUser.id.startsWith('U-')) {
    const currentId = parseInt(lastUser.id.split('-')[1]);
    nextId = `U-${(currentId + 1).toString().padStart(4, '0')}`;
  }
  userData.id = nextId;

  // Email Verification Logic
  const verificationToken = crypto.randomBytes(32).toString('hex');
  userData.emailVerificationToken = verificationToken;
  // Token valid for 24 hours
  userData.emailVerificationExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000,
  );
  userData.isEmailVerified = false;

  const newUser = await User.create(userData);

  // Send Email asynchronously
  const frontendUrl = config.frontend_url || 'http://localhost:3000';
  const verifyLink = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

  try {
    await sendVerificationEmail(newUser.email, {
      userName: newUser.name,
      verifyLink,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
    // You might want to handle this differently in production (e.g. queue)
  }

  return newUser;
};

const getMe = async (userId: JwtPayload) => {
  const result = await User.findById(userId);
  return result;
};

const changeStatus = async (payload: { status: string }, id: string) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const updateMyProfile = async (
  payload: JwtPayload,
  userData: Partial<IUser>,
) => {
  const { userId } = payload;
  const result = await User.findOneAndUpdate({ id: userId }, userData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// get only sellers
const getSellers = async () => {
  const result = await User.find({ role: 'seller' });
  return result;
};
export const UserServices = {
  createUserIntoDB,
  getMe,
  changeStatus,
  updateMyProfile,
  getSellers,
};

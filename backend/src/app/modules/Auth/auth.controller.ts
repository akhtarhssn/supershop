import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';
import { AppError } from '../../errors/AppError';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // console.log(result);

  const { refreshToken, accessToken, needPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Login successful',
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword(req.user, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Changed successful',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access Token retrieved successfully',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const { id } = req.body;

  const result = await AuthServices.forgetPassword(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link generated successfully',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  if (!req?.headers?.authorization) {
    throw new AppError(httpStatus.FORBIDDEN, 'No Authorization');
  }

  const token = req?.headers?.authorization;

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Reset successful',
    data: result,
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Verification token is required');
  }

  const result = await AuthServices.verifyEmail(token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const resendVerificationEmail = catchAsync(async (req, res) => {
  // req.user is populated by auth() middleware
  const { userId } = req.user;

  const result = await AuthServices.resendVerificationEmail(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
};

import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const { password, ...userData } = req.body;

  const result = await UserServices.createUserIntoDB(password, userData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await UserServices.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User data retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await UserServices.changeStatus(req.body, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status changed successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserServices.updateMyProfile(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

// get only sellers
const getSellers = catchAsync(async (req, res) => {
  const result = await UserServices.getSellers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sellers retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getMe,
  changeStatus,
  updateMyProfile,
  getSellers,
};

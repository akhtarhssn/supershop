import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';
import { USER_ROLE } from '../user/user.constant';

const getStats = catchAsync(async (req, res) => {
  const user = req.user;
  let result;

  if (user.role === USER_ROLE.superAdmin || user.role === USER_ROLE.admin) {
    result = await DashboardServices.getAdminStats();
  } else if (user.role === USER_ROLE.seller) {
    result = await DashboardServices.getSellerStats(user.userId);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

export const DashboardControllers = {
  getStats,
};

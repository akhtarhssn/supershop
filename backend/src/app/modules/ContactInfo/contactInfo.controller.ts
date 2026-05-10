import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContactInfoServices } from './contactInfo.service';

const getContactInfo = catchAsync(async (req, res) => {
  const result = await ContactInfoServices.getContactInfo();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact Info retrieved successfully',
    data: result,
  });
});

const updateContactInfo = catchAsync(async (req, res) => {
  const result = await ContactInfoServices.updateContactInfo(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Contact Info updated successfully',
    data: result,
  });
});

export const ContactInfoControllers = {
  getContactInfo,
  updateContactInfo,
};

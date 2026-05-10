import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PartnerServices } from './partner.service';

const createPartner = catchAsync(async (req, res) => {
  const result = await PartnerServices.createPartner(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Partner created successfully',
    data: result,
  });
});

const getAllPartners = catchAsync(async (req, res) => {
  const result = await PartnerServices.getAllPartners(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partners retrieved successfully',
    data: result,
  });
});

const getSinglePartner = catchAsync(async (req, res) => {
  const result = await PartnerServices.getSinglePartner(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner retrieved successfully',
    data: result,
  });
});

const updatePartner = catchAsync(async (req, res) => {
  const result = await PartnerServices.updatePartner(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner updated successfully',
    data: result,
  });
});

const deletePartner = catchAsync(async (req, res) => {
  const result = await PartnerServices.deletePartner(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Partner deleted successfully',
    data: result,
  });
});

export const PartnerControllers = {
  createPartner,
  getAllPartners,
  getSinglePartner,
  updatePartner,
  deletePartner,
};

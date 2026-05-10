import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BrandServices } from './brand.service';

const createBrand = catchAsync(async (req, res) => {
  const result = await BrandServices.createBrand(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Brand created successfully',
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const result = await BrandServices.getAllBrands(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brands retrieved successfully',
    data: result,
  });
});

const getSingleBrand = catchAsync(async (req, res) => {
  const result = await BrandServices.getSingleBrand(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand retrieved successfully',
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const result = await BrandServices.updateBrand(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand updated successfully',
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const result = await BrandServices.deleteBrand(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Brand deleted successfully',
    data: result,
  });
});

export const BrandControllers = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};

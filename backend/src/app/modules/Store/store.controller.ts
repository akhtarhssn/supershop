import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StoreServices } from './store.service';
import { User } from '../user/user.model';
import { AppError } from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageCloudinary';

const createStore = catchAsync(async (req, res) => {
  const seller = req.user.userId;

  const storeData: any = {
    ...req.body,
    seller,
  };

  const files = req.files as {
    logo?: Express.Multer.File[];
    banner?: Express.Multer.File[];
  };

  // ✅ Upload logo
  if (files?.logo?.[0]) {
    const result = await sendImageToCloudinary(
      files.logo[0].buffer,
      files.logo[0].originalname,
    );

    storeData.logo = result.secure_url;
  }

  // ✅ Upload banner
  if (files?.banner?.[0]) {
    const result = await sendImageToCloudinary(
      files.banner[0].buffer,
      files.banner[0].originalname,
    );

    storeData.banner = result.secure_url;
  }

  const result = await StoreServices.createStoreIntoDB(storeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store created successfully',
    data: result,
  });
});

const getAllStores = catchAsync(async (req, res) => {
  const result = await StoreServices.getAllStoresFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stores retrieved successfully',
    data: result,
  });
});

const getSingleStore = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await StoreServices.getSingleStoreFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store retrieved successfully',
    data: result,
  });
});

const getMyStore = catchAsync(async (req, res) => {
  const sellerId = req.user.userId;
  const result = await StoreServices.getMyStoreFromDB(sellerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My store data retrieved successfully',
    data: result,
  });
});

const updateStore = catchAsync(async (req, res) => {
  const { id } = req.params;
  const storeData: any = {
    ...req.body,
    seller: req.user.userId,
  };

  const files = req.files as {
    logo?: Express.Multer.File[];
    banner?: Express.Multer.File[];
  };

  // ✅ Upload logo
  if (files?.logo?.[0]) {
    const result = await sendImageToCloudinary(
      files.logo[0].buffer,
      files.logo[0].originalname,
    );

    storeData.logo = result.secure_url;
  }

  // ✅ Upload banner
  if (files?.banner?.[0]) {
    const result = await sendImageToCloudinary(
      files.banner[0].buffer,
      files.banner[0].originalname,
    );

    storeData.banner = result.secure_url;
  }

  const result = await StoreServices.updateStoreIntoDB(id, storeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store updated successfully',
    data: result,
  });
});

const deleteStore = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StoreServices.deleteStoreFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Store deleted successfully',
    data: result,
  });
});

export const StoreControllers = {
  createStore,
  getAllStores,
  getSingleStore,
  getMyStore,
  updateStore,
  deleteStore,
};

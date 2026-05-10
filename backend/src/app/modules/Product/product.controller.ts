import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProductServices } from './product.service';
import { Store } from '../Store/store.model';
import { AppError } from '../../errors/AppError';
import { User } from '../user/user.model';
import { sendImageToCloudinary } from '../../utils/sendImageCloudinary';

const createProduct = catchAsync(async (req, res) => {
  const sellerId = req.user.userId;

  const findSeller = await User.findById(sellerId);

  if (!findSeller) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not Found.');
  }

  // Find the seller's store
  const store = await Store.findOne({ seller: findSeller._id });
  if (!store) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Seller does not have a store. Create a store first.',
    );
  }

  const productData = req.body;

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadPromises = req.files.map((file: any) =>
      sendImageToCloudinary(file.buffer, file.originalname),
    );
    const results = await Promise.all(uploadPromises);
    productData.images = results.map((r: any) => r.secure_url);
    productData.image = productData.images[0];
  }

  if (!productData.image) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Main image is required.');
  }

  const result = await ProductServices.createProductIntoDB({
    ...productData,
    store: store._id,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.getSingleProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const getMyProductsFromDB = catchAsync(async (req, res) => {
  const sellerId = req.user.userId;

  const result = await ProductServices.getMyProductsFromDB(sellerId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const productData = req.body;

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const uploadPromises = req.files.map((file: any) =>
      sendImageToCloudinary(file.buffer, file.originalname),
    );
    const results = await Promise.all(uploadPromises);
    const newImages = results.map((r: any) => r.secure_url);
    productData.images = [...(productData.images || []), ...newImages];
    productData.image = productData.images[0];
  }

  const result = await ProductServices.updateProductIntoDB(id, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  getMyProductsFromDB,
  updateProduct,
  deleteProduct,
};

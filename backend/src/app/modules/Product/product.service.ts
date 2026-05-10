import mongoose from 'mongoose';
import { Category } from '../Category/category.model';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { Store } from '../Store/store.model';

const createProductIntoDB = async (payload: IProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  // If category is provided as a slug, convert it to its corresponding ObjectId
  if (queryObj.category && typeof queryObj.category === 'string') {
    if (!mongoose.Types.ObjectId.isValid(queryObj.category)) {
      const categoryDoc = await Category.findOne({ slug: queryObj.category });
      if (categoryDoc) {
        queryObj.category = categoryDoc._id;
      } else {
        // If no category found with that slug, set to a non-existent ObjectId to ensure empty result
        queryObj.category = new mongoose.Types.ObjectId();
      }
    }
  }

  const productQuery = new QueryBuilder(
    Product.find().populate('category').populate('store'),
    queryObj,
  )
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return { result, meta };
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id)
    .populate('category')
    .populate('store');
  return result;
};

const getMyProductsFromDB = async (sellerId: string) => {
  // Verify user exists and is actually a seller
  const seller = await User.findById(sellerId);
  if (!seller) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found.');
  }

  // Find the store associated with this seller
  const store = await Store.findOne({ seller: seller._id });

  // Handle the case where a store record doesn't exist yet
  if (!store) {
    return [];
  }

  // Retrieve products matching that specific Store ID
  const result = await Product.find({
    store: store._id,
    isDeleted: { $ne: true },
  })
    .populate('category')
    .populate('store')
    .sort('-createdAt');

  return result;
};

const updateProductIntoDB = async (id: string, payload: Partial<IProduct>) => {
  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  getMyProductsFromDB,
  updateProductIntoDB,
  deleteProductFromDB,
};

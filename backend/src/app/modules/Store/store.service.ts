import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { ICreateStorePayload, IStore } from './store.interface';
import { Store } from './store.model';
import { User } from '../user/user.model';

const createStoreIntoDB = async (payload: ICreateStorePayload) => {
  const sellerId = payload.seller;

  // ✅ check seller exists (lighter query)
  const sellerExists = await User.exists({ _id: sellerId });

  if (!sellerExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found.');
  }

  // ✅ prevent duplicate store
  const isStoreExists = await Store.exists({ seller: sellerId });

  if (isStoreExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You already have a store.');
  }

  // ✅ whitelist fields (IMPORTANT)
  const storeData = {
    name: payload.name,
    description: payload.description || '',
    logo: payload.logo || '',
    banner: payload.banner || '',
    supportEmail: payload.supportEmail || '',
    supportPhone: payload.supportPhone || '',
    seller: sellerId,
    status: 'Active', // enforce default
  };

  const result = await Store.create(storeData);

  return result;
};

const getAllStoresFromDB = async () => {
  const result = await Store.find().populate('seller');
  return result;
};

const getSingleStoreFromDB = async (id: string) => {
  const result = await Store.findById(id).populate('seller');
  return result;
};

const getMyStoreFromDB = async (sellerId: string) => {
  const findSeller = await User.findById(sellerId);
  if (!findSeller) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not Found.');
  }
  const result = await Store.findOne({ seller: findSeller._id }).populate(
    'seller',
  );
  return result;
};

const updateStoreIntoDB = async (id: string, payload: Partial<IStore>) => {
  const result = await Store.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStoreFromDB = async (id: string) => {
  const result = await Store.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const StoreServices = {
  createStoreIntoDB,
  getAllStoresFromDB,
  getSingleStoreFromDB,
  getMyStoreFromDB,
  updateStoreIntoDB,
  deleteStoreFromDB,
};

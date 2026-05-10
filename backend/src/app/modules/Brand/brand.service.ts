import { Brand } from './brand.model';
import { IBrand } from './brand.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createBrand = async (payload: IBrand) => {
  return await Brand.create(payload);
};

const getAllBrands = async (query: Record<string, unknown>) => {
  const brandQuery = new QueryBuilder(Brand.find(), query)
    .search(['name', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await brandQuery.modelQuery;
  const meta = await brandQuery.countTotal();

  return { result, meta };
};

const getSingleBrand = async (id: string) => {
  return await Brand.findById(id);
};

const updateBrand = async (id: string, payload: Partial<IBrand>) => {
  return await Brand.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBrand = async (id: string) => {
  return await Brand.findByIdAndDelete(id);
};

export const BrandServices = {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};

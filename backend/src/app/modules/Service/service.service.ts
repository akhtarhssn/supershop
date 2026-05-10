import { Service } from './service.model';
import { IService } from './service.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createService = async (payload: IService) => {
  return await Service.create(payload);
};

const getAllServices = async (query: Record<string, unknown>) => {
  const serviceQuery = new QueryBuilder(Service.find(), query)
    .search(['title', 'description'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await serviceQuery.modelQuery;
  const meta = await serviceQuery.countTotal();

  return { result, meta };
};

const getSingleService = async (id: string) => {
  return await Service.findById(id);
};

const updateService = async (id: string, payload: Partial<IService>) => {
  return await Service.findByIdAndUpdate(id, payload, { new: true });
};

const deleteService = async (id: string) => {
  return await Service.findByIdAndDelete(id);
};

export const ServiceServices = {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
};

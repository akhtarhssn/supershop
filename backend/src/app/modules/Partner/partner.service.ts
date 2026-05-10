import { Partner } from './partner.model';
import { IPartner } from './partner.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const createPartner = async (payload: IPartner) => {
  return await Partner.create(payload);
};

const getAllPartners = async (query: Record<string, unknown>) => {
  const partnerQuery = new QueryBuilder(Partner.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await partnerQuery.modelQuery;
  const meta = await partnerQuery.countTotal();

  return { result, meta };
};

const getSinglePartner = async (id: string) => {
  return await Partner.findById(id);
};

const updatePartner = async (id: string, payload: Partial<IPartner>) => {
  return await Partner.findByIdAndUpdate(id, payload, { new: true });
};

const deletePartner = async (id: string) => {
  return await Partner.findByIdAndDelete(id);
};

export const PartnerServices = {
  createPartner,
  getAllPartners,
  getSinglePartner,
  updatePartner,
  deletePartner,
};

import { ContactInfo } from './contactInfo.model';
import { IContactInfo } from './contactInfo.interface';

const getContactInfo = async () => {
  // We assume there's only one contact info document
  let contact = await ContactInfo.findOne();
  if (!contact) {
    contact = await ContactInfo.create({
      email: 'contact@ninkipal.com',
      phone: '+1 234 567 890',
      address: '123 E-commerce St, NY 10001',
    });
  }
  return contact;
};

const updateContactInfo = async (payload: Partial<IContactInfo>) => {
  const contact = await ContactInfo.findOne();
  if (!contact) {
    return await ContactInfo.create(payload);
  }
  return await ContactInfo.findByIdAndUpdate(contact._id, payload, { new: true });
};

export const ContactInfoServices = {
  getContactInfo,
  updateContactInfo,
};

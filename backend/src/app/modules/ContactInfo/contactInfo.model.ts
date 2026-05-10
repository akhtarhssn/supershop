import { Schema, model } from 'mongoose';
import { IContactInfo } from './contactInfo.interface';

const contactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  {
    timestamps: true,
  }
);

export const ContactInfo = model<IContactInfo>('ContactInfo', contactInfoSchema);

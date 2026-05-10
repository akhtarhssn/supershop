import { Schema, model } from 'mongoose';
import { IPartner } from './partner.interface';

const partnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
  }
);

export const Partner = model<IPartner>('Partner', partnerSchema);

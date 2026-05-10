import { Schema, model } from 'mongoose';
import { IBrand } from './brand.interface';

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
  }
);

export const Brand = model<IBrand>('Brand', brandSchema);

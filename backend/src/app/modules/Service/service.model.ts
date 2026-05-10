import { Schema, model } from 'mongoose';
import { IService } from './service.interface';

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  },
  {
    timestamps: true,
  }
);

export const Service = model<IService>('Service', serviceSchema);

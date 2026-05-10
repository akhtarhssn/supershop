import { Types } from 'mongoose';

export interface IStore {
  name: string;
  logo?: string;
  banner?: string;
  description?: string;
  supportEmail?: string;
  supportPhone?: string;
  seller: Types.ObjectId; // Reference to User
  location?: string;
  rating?: number;
  followers?: number;
  status: 'Active' | 'Blocked';
  isDeleted: boolean;
}

export interface ICreateStorePayload {
  name: string;
  description?: string;
  logo?: string;
  banner?: string;
  supportEmail?: string;
  supportPhone?: string;
  seller: string;
}

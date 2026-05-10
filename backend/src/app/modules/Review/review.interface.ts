import { Types } from 'mongoose';

export interface IReview {
  user: Types.ObjectId; // Buyer
  product: Types.ObjectId;
  rating: number; // 1-5
  comment: string;
  isDeleted: boolean;
}

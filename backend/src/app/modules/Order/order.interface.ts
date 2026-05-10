import { Types } from 'mongoose';

export interface IOrderProduct {
  product: Types.ObjectId;
  quantity: number;
  price: number;
  seller?: Types.ObjectId;
  sellerEarnings?: number;
}

export interface IOrder {
  orderNumber: string;
  user?: Types.ObjectId;
  email?: string;
  products: IOrderProduct[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  adminCommission?: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  transactionId?: string;
  isDeleted: boolean;
}

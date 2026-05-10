import { Types } from 'mongoose';

export interface IBankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode?: string;
  routingNumber?: string;
  isDefault: boolean;
}

export interface IWithdrawal {
  seller: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  bankDetails: IBankDetails;
  rejectionReason?: string;
  processedAt?: Date;
  isDeleted: boolean;
}

export interface ISellerWallet {
  seller: Types.ObjectId;
  totalEarnings: number;
  pendingBalance: number;
  availableBalance: number;
  totalWithdrawn: number;
  bankDetails: IBankDetails[];
  isDeleted: boolean;
}

export interface ISellerWalletMethods {
  addEarnings(amount: number): Promise<void>;
  deductPending(amount: number): Promise<void>;
  processWithdrawal(amount: number): Promise<void>;
}
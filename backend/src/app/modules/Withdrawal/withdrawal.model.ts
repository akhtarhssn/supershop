import { Schema, model, HydratedDocument } from 'mongoose';
import { IWithdrawal, IBankDetails } from './withdrawal.interface';

const bankDetailsSchema = new Schema<IBankDetails>(
  {
    bankName: { type: String, required: true },
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branchCode: { type: String },
    routingNumber: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const withdrawalSchema = new Schema<IWithdrawal>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    bankDetails: {
      type: bankDetailsSchema,
      required: true,
    },
    rejectionReason: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

withdrawalSchema.index({ seller: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });

const SellerWalletSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    totalEarnings: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    pendingBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    totalWithdrawn: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    bankDetails: {
      type: [bankDetailsSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

SellerWalletSchema.index({ seller: 1 });

export const Withdrawal = model<IWithdrawal>('Withdrawal', withdrawalSchema);
export const SellerWallet = model('SellerWallet', SellerWalletSchema);
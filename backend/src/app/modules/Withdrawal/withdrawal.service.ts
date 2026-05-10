/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '../../errors/AppError';
import { IBankDetails } from './withdrawal.interface';
import { SellerWallet, Withdrawal } from './withdrawal.model';

const ADMIN_COMMISSION_RATE = 0.2;

class WithdrawalService {
  async getOrCreateWallet(sellerId: string) {
    let wallet = await SellerWallet.findOne({
      seller: sellerId,
      isDeleted: { $ne: true },
    });

    if (!wallet) {
      wallet = await SellerWallet.create({
        seller: sellerId,
        totalEarnings: 0,
        pendingBalance: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        bankDetails: [],
      });
    }

    return wallet;
  }

  async addBankDetails(sellerId: string, bankDetails: IBankDetails) {
    const wallet = await SellerWallet.findOne({
      seller: sellerId,
      isDeleted: { $ne: true },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    if (bankDetails.isDefault) {
      wallet.bankDetails.forEach((bank) => {
        bank.isDefault = false;
      });
    }

    wallet.bankDetails.push(bankDetails as any);
    await wallet.save();

    return wallet;
  }

  async removeBankDetails(sellerId: string, bankId: string) {
    const wallet = await SellerWallet.findOne({
      seller: sellerId,
      isDeleted: { $ne: true },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    const bankDetails = wallet.bankDetails as any[];
    wallet.bankDetails = bankDetails.filter(
      (bank) => bank._id?.toString() !== bankId,
    ) as any;
    await wallet.save();

    return wallet;
  }

  async requestWithdrawal(
    sellerId: string,
    amount: number,
    bankDetailsId: string,
  ) {
    if (amount <= 0) {
      throw new AppError(400, 'Withdrawal amount must be greater than 0');
    }

    const wallet = await SellerWallet.findOne({
      seller: sellerId,
      isDeleted: { $ne: true },
    });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    if (wallet.availableBalance < amount) {
      throw new AppError(400, 'Insufficient balance');
    }

    const bankDetails = wallet.bankDetails.find(
      (bank) => bank._id?.toString() === bankDetailsId,
    );

    if (!bankDetails) {
      throw new AppError(404, 'Bank details not found');
    }

    wallet.availableBalance -= amount;
    wallet.pendingBalance += amount;
    await wallet.save();

    const withdrawal = await Withdrawal.create({
      seller: sellerId,
      amount,
      status: 'pending',
      bankDetails,
    });

    return withdrawal;
  }

  async getSellerWithdrawals(sellerId: string) {
    return Withdrawal.find({ seller: sellerId, isDeleted: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(20);
  }

  async getSellerEarnings(sellerId: string) {
    return this.getOrCreateWallet(sellerId);
  }

  async addSellerEarnings(
    sellerId: string,
    orderTotal: number,
    sellerShare: number,
  ) {
    const commission = orderTotal * ADMIN_COMMISSION_RATE;
    const earnings = sellerShare - commission;

    let wallet = await SellerWallet.findOne({
      seller: sellerId,
      isDeleted: { $ne: true },
    });

    if (!wallet) {
      wallet = await SellerWallet.create({
        seller: sellerId,
        totalEarnings: 0,
        pendingBalance: 0,
        availableBalance: 0,
        totalWithdrawn: 0,
        bankDetails: [],
      });
    }

    wallet.totalEarnings += earnings;
    wallet.availableBalance += earnings;
    await wallet.save();

    return wallet;
  }

  async processWithdrawalApproval(
    withdrawalId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
  ) {
    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      throw new AppError(404, 'Withdrawal not found');
    }

    const wallet = await SellerWallet.findOne({ seller: withdrawal.seller });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    if (status === 'approved') {
      withdrawal.status = 'approved';
      withdrawal.processedAt = new Date();
    } else if (status === 'rejected') {
      withdrawal.status = 'rejected';
      withdrawal.rejectionReason = rejectionReason;
      wallet.pendingBalance -= withdrawal.amount;
      wallet.availableBalance += withdrawal.amount;
      await wallet.save();
    }

    await withdrawal.save();
    return withdrawal;
  }

  async completeWithdrawal(withdrawalId: string) {
    const withdrawal = await Withdrawal.findById(withdrawalId);

    if (!withdrawal) {
      throw new AppError(404, 'Withdrawal not found');
    }

    const wallet = await SellerWallet.findOne({ seller: withdrawal.seller });

    if (!wallet) {
      throw new AppError(404, 'Wallet not found');
    }

    withdrawal.status = 'completed';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    wallet.pendingBalance -= withdrawal.amount;
    wallet.totalWithdrawn += withdrawal.amount;
    await wallet.save();

    return withdrawal;
  }

  async getPendingWithdrawals() {
    return Withdrawal.find({ status: 'pending', isDeleted: { $ne: true } })
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
  }
}

export { ADMIN_COMMISSION_RATE, WithdrawalService };
export const withdrawalService = new WithdrawalService();

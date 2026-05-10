import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { IBankDetails } from './withdrawal.interface';
import { withdrawalService } from './withdrawal.service';

export const WithdrawalController = {
  getMyWallet: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const wallet = await withdrawalService.getOrCreateWallet(sellerId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: wallet,
    });
  },

  addBankDetails: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const {
      bankName,
      accountName,
      accountNumber,
      branchCode,
      routingNumber,
      isDefault,
    } = req.body as IBankDetails;

    const bankDetails: IBankDetails = {
      bankName: bankName || '',
      accountName: accountName || '',
      accountNumber: accountNumber || '',
      branchCode,
      routingNumber,
      isDefault: isDefault || false,
    };

    const wallet = await withdrawalService.addBankDetails(
      sellerId,
      bankDetails,
    );

    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      data: wallet,
    });
  },

  removeBankDetails: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const { bankId } = req.params;

    const wallet = await withdrawalService.removeBankDetails(sellerId, bankId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: wallet,
    });
  },

  requestWithdrawal: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const { amount, bankDetailsId } = req.body as {
      amount: number;
      bankDetailsId: string;
    };

    const withdrawal = await withdrawalService.requestWithdrawal(
      sellerId,
      amount,
      bankDetailsId,
    );

    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      data: withdrawal,
    });
  },

  getMyWithdrawals: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const withdrawals = await withdrawalService.getSellerWithdrawals(sellerId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: withdrawals,
    });
  },

  getSellerEarnings: async (req: Request, res: Response) => {
    const sellerId = req.user.userId;

    if (!sellerId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User not authenticated',
      });
    }

    const wallet = await withdrawalService.getSellerEarnings(sellerId);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: wallet,
    });
  },
};

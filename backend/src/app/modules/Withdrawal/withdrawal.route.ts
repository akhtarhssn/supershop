import express from 'express';
import { WithdrawalController } from './withdrawal.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/wallet', auth('seller'), WithdrawalController.getMyWallet);
router.get('/earnings', auth('seller'), WithdrawalController.getSellerEarnings);
router.get('/history', auth('seller'), WithdrawalController.getMyWithdrawals);
router.post('/bank', auth('seller'), WithdrawalController.addBankDetails);
router.delete('/bank/:bankId', auth('seller'), WithdrawalController.removeBankDetails);
router.post('/withdraw', auth('seller'), WithdrawalController.requestWithdrawal);

export const WithdrawalRoutes = router;
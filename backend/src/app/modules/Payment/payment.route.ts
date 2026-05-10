import { Router } from 'express';
import { PaymentControllers } from './payment.controller';

const router = Router();

router.post(
  '/create-payment-intent',
  PaymentControllers.createPaymentIntent
);

export const PaymentRoutes = router;

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentServices } from './payment.service';

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { amount, currency } = req.body;
  const result = await PaymentServices.createPaymentIntent(amount, currency);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment intent created successfully',
    data: result,
  });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const result = await PaymentServices.handleWebhook(
    req.body, // Note: Webhook needs raw body
    signature
  );

  res.status(httpStatus.OK).send(result);
});

export const PaymentControllers = {
  createPaymentIntent,
  handleWebhook,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from 'stripe';
import config from '../../config';
import { Order } from '../Order/order.model';
import { EmailServices } from '../Email/email.service';

const stripe = new Stripe(config.stripe_secret_key as string);

const createPaymentIntent = async (
  amount: number,
  currency: string = 'usd',
) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency,
    payment_method_types: ['card'],
  });

  return {
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

const handleWebhook = async (payload: string, signature: string) => {
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe_webhook_secret as string,
    );
  } catch (err: any) {
    throw new Error(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;

    // Update order status in DB and populate for email
    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      {
        paymentStatus: 'paid',
        status: 'processing',
      },
      { new: true },
    )
      .populate('user')
      .populate('products.product');

    if (updatedOrder) {
      console.log(
        `Payment succeeded for order ${updatedOrder.orderNumber}. Sending invoice email...`,
      );
      const recipientEmail =
        updatedOrder.email || (updatedOrder.user as any)?.email;
      if (recipientEmail) {
        try {
          await EmailServices.sendInvoiceEmail(updatedOrder, recipientEmail);
        } catch (emailError) {
          console.error(
            'Failed to send invoice email after payment success:',
            emailError,
          );
        }
      } else {
        console.log(
          `No email found for order ${updatedOrder.orderNumber}, skipping invoice.`,
        );
      }
    }
  }

  return { received: true };
};

export const PaymentServices = {
  createPaymentIntent,
  handleWebhook,
};

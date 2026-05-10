import { z } from 'zod';

const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(
      z.object({
        product: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      }),
    ).min(1, 'At least one product is required'),
    subtotal: z.number().nonnegative(),
    shipping: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    total: z.number().positive(),
    paymentMethod: z.string(),
    email: z.string().email().optional(),
    shippingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }),
  }),
});

const updateOrderStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderStatusValidationSchema,
};

import { z } from 'zod';

const createStoreValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Store name is required',
    }),
    logo: z.string().optional(),
    banner: z.string().optional(),
    description: z.string().optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().optional(),
    location: z.string().optional(),
  }),
});

const updateStoreValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
    description: z.string().optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().optional(),
    location: z.string().optional(),
    status: z.enum(['Active', 'Blocked']).optional(),
  }),
});

export const StoreValidation = {
  createStoreValidationSchema,
  updateStoreValidationSchema,
};

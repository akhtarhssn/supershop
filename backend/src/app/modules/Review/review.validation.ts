import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    product: z.string({ required_error: 'Product ID is required' }),
    rating: z.number().min(1).max(5),
    comment: z.string({ required_error: 'Comment is required' }),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
};

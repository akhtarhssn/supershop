import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    slug: z.string({
      required_error: 'Slug is required',
    }),
    image: z.string({
      required_error: 'Image is required',
    }),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    image: z.string().optional(),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};

import { z } from 'zod';

const createProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Product name is required' }),
    slug: z.string({ required_error: 'Slug is required' }),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number({ required_error: 'Price is required' }).positive(),
    originalPrice: z.number({ required_error: 'Original price is required' }).positive(),
    discount: z.number().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z.string({ required_error: 'Category is required' }),
    stock: z.number({ required_error: 'Stock is required' }).int().nonnegative(),
    unit: z.string({ required_error: 'Unit is required' }),
    weight: z.string({ required_error: 'Weight is required' }),
    brand: z.string({ required_error: 'Brand is required' }),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isNewProduct: z.boolean().optional(),
    isOrganic: z.boolean().optional(),
    isFlashSale: z.boolean().optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    originalPrice: z.number().positive().optional(),
    discount: z.number().optional(),
    image: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    stock: z.number().int().nonnegative().optional(),
    unit: z.string().optional(),
    weight: z.string().optional(),
    brand: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isNewProduct: z.boolean().optional(),
    isOrganic: z.boolean().optional(),
    isFlashSale: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  createProductValidationSchema,
  updateProductValidationSchema,
};

import { z } from 'zod';
import { UserStatus } from './user.constant';

const userValidationSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }),
    email: z.string().email(),
    phone: z.string({ required_error: 'Phone number is required' }),
    avatar: z.string().optional(),
    address: z.string().optional(),
    password: z
      .string({
        invalid_type_error: 'Password must be a valid string',
      })
      .max(30, { message: 'Password cannot be more than 30 characters' })
      .optional(),
    role: z.enum(['superAdmin', 'admin', 'seller', 'buyer']).optional(),
    status: z.enum(['Active', 'Blocked']).default('Active').optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  userValidationSchema,
  changeStatusValidationSchema,
};

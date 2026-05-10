import { z } from 'zod';

const LoginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'An email is required' }),
    password: z.string({ required_error: 'The password is required' }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'The old password is required' }),
    newPassword: z.string({ required_error: 'The New password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User ID is required' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'User ID is required' }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
});

export const AuthZodValidation = {
  LoginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};

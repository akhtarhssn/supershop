import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthZodValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthZodValidation.LoginValidationSchema),
  AuthControllers.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller, USER_ROLE.buyer),
  validateRequest(AuthZodValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthZodValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

router.post(
  '/forgot-password',
  validateRequest(AuthZodValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

router.post(
  '/reset-password',
  validateRequest(AuthZodValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

// Public: verify email via token in query string
router.get('/verify-email', AuthControllers.verifyEmail);

// Protected: resend verification email (must be logged in)
router.post(
  '/resend-verification-email',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller, USER_ROLE.buyer),
  AuthControllers.resendVerificationEmail,
);

export const AuthRoutes = router;

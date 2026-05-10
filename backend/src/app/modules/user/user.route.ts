import { Router } from 'express';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/create-user',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createUser,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get(
  '/me',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  UserController.getMe,
);

router.patch(
  '/update-my-profile',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  UserController.updateMyProfile,
);

router.get(
  '/sellers',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserController.getSellers,
);

export const UserRoutes = router;

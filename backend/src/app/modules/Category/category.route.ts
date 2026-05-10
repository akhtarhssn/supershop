import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { CategoryControllers } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CategoryValidation.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', CategoryControllers.getSingleCategory);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CategoryValidation.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;

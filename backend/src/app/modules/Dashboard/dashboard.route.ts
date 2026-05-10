import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/stats',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  DashboardControllers.getStats,
);

export const DashboardRoutes = router;

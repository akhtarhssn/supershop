import express from 'express';
import { NotificationController } from './notification.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  NotificationController.getMyNotifications,
);
router.get(
  '/unread-count',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  NotificationController.getUnreadCount,
);
router.patch(
  '/:notificationId/read',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  NotificationController.markAsRead,
);
router.patch(
  '/read-all',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  NotificationController.markAllAsRead,
);

export const NotificationRoutes = router;

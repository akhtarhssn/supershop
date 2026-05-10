import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { OrderControllers } from './order.controller';
import { OrderValidation } from './order.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  auth(
    USER_ROLE.buyer,
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
  ),
  validateRequest(OrderValidation.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  OrderControllers.getAllOrders,
);

router.get('/my-orders', auth(USER_ROLE.buyer), OrderControllers.getMyOrders);

router.patch(
  '/:id/status',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.seller),
  validateRequest(OrderValidation.updateOrderStatusValidationSchema),
  OrderControllers.updateOrderStatus,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  OrderControllers.getSingleOrder,
);

router.get(
  '/:id/invoice',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.seller,
    USER_ROLE.buyer,
  ),
  OrderControllers.downloadInvoice,
);

export const OrderRoutes = router;

import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CategoryRoutes } from '../modules/Category/category.route';
import { StoreRoutes } from '../modules/Store/store.route';
import { ProductRoutes } from '../modules/Product/product.route';
import { OrderRoutes } from '../modules/Order/order.route';
import { ReviewRoutes } from '../modules/Review/review.route';
import { DashboardRoutes } from '../modules/Dashboard/dashboard.route';
import { PaymentRoutes } from '../modules/Payment/payment.route';
import { PartnerRoutes } from '../modules/Partner/partner.route';
import { ServiceRoutes } from '../modules/Service/service.route';
import { BlogRoutes } from '../modules/Blog/blog.route';
import { BrandRoutes } from '../modules/Brand/brand.route';
import { ContactInfoRoutes } from '../modules/ContactInfo/contactInfo.route';
import { NotificationRoutes } from '../modules/Notification/notification.route';
import { WithdrawalRoutes } from '../modules/Withdrawal/withdrawal.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/stores',
    route: StoreRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoutes,
  },
  {
    path: '/payments',
    route: PaymentRoutes,
  },
  {
    path: '/partners',
    route: PartnerRoutes,
  },
  {
    path: '/services',
    route: ServiceRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
  {
    path: '/contact-info',
    route: ContactInfoRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/withdrawals',
    route: WithdrawalRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

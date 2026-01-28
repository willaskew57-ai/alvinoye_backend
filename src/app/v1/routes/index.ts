// ** imports packages
import express, { Router } from 'express';

// ** import module routes
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { DriverRoutes } from '../modules/driver/driver.route';
import { ParcelRoutes } from '../modules/parcel/parcel.route';
import { SettingsRoutes } from '../modules/setting/settings.routes';
import { ChatRoutes } from '../modules/chat/chat.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { PaymentRoute } from '../modules/payment/payment.route';
import { CustomerRoutes } from '../modules/cusotmer/customer.route';
import { DashboardRoute } from '../modules/dashboard/dashboard.route';

const router = express.Router();

interface TModuleRoutes {
  path: string;
  route: Router;
}

const modulesRoute: TModuleRoutes[] = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/driver',
    route: DriverRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/parcel',
    route: ParcelRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoute,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/settings',
    route: SettingsRoutes,
  },
  {
    path: '/dashboard',
    route: DashboardRoute,
  },
];

modulesRoute.forEach((route) => router.use(route.path, route.route));

export default router;

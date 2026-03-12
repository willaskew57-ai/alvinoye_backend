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
import { RefundRoutes } from '../modules/refund/refund.route';
import { NotificationRoutes } from '../modules/notification/notification.routes';
const router = express.Router();
const modulesRoute = [
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
        path: '/parcel',
        route: ParcelRoutes,
    },
    {
        path: '/refund',
        route: RefundRoutes,
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
    {
        path: '/notifications',
        route: NotificationRoutes,
    },
];
modulesRoute.forEach((route) => router.use(route.path, route.route));
export default router;
//# sourceMappingURL=index.js.map
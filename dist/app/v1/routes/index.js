"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ** imports packages
const express_1 = __importDefault(require("express"));
// ** import module routes
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const driver_route_1 = require("../modules/driver/driver.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const settings_routes_1 = require("../modules/setting/settings.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const review_routes_1 = require("../modules/review/review.routes");
const payment_route_1 = require("../modules/payment/payment.route");
const customer_route_1 = require("../modules/cusotmer/customer.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const refund_route_1 = require("../modules/refund/refund.route");
const notification_routes_1 = require("../modules/notification/notification.routes");
const router = express_1.default.Router();
const modulesRoute = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/driver',
        route: driver_route_1.DriverRoutes,
    },
    {
        path: '/customer',
        route: customer_route_1.CustomerRoutes,
    },
    {
        path: '/parcel',
        route: parcel_route_1.ParcelRoutes,
    },
    {
        path: '/payments',
        route: payment_route_1.PaymentRoute,
    },
    {
        path: '/refund',
        route: refund_route_1.RefundRoutes,
    },
    {
        path: '/chat',
        route: chat_routes_1.ChatRoutes,
    },
    {
        path: '/review',
        route: review_routes_1.ReviewRoutes,
    },
    {
        path: '/settings',
        route: settings_routes_1.SettingsRoutes,
    },
    {
        path: '/dashboard',
        route: dashboard_route_1.DashboardRoute,
    },
    {
        path: '/notifications',
        route: notification_routes_1.NotificationRoutes,
    },
];
modulesRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
//# sourceMappingURL=index.js.map
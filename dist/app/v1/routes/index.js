// ** imports packages
import express, { Router } from 'express';
// ** import module routes
import { UserRoutes } from '../modules/user/user.route';
import { SettingsRoutes } from '../modules/settings/settings.route';
import { AuthRoutes } from '../modules/auth/auth.route';
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
        path: '/settings',
        route: SettingsRoutes,
    },
];
modulesRoute.forEach((route) => router.use(route.path, route.route));
export default router;
//# sourceMappingURL=index.js.map
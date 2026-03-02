// route.ts
import express from 'express';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from '../user/user.interface';
import { getDashboardStats, getParcelMovementStats, getParcelOwnerGrowth } from './dashboard.controller';
const router = express.Router();
router.get('/stats', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), getDashboardStats);
router.get('/parcel-movement', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), getParcelMovementStats);
router.get('/parcel-owner-growth', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), getParcelOwnerGrowth);
export const DashboardRoute = router;
//# sourceMappingURL=dashboard.route.js.map
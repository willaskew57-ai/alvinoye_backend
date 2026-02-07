import express from 'express';
import { RefundControllers } from './refund.controller';
import { adminRefundDecisionSchema, requestRefundSchema } from './refund.validation';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from '../user/user.interface';
import validateRequest from '../../../../middleware/validate-request';
const router = express.Router();
// User requests refund for a specific parcel
router.post('/request/:parcelId', auth(USER_ROLE.CUSTOMER), validateRequest(requestRefundSchema), RefundControllers.requestRefund);
// Admin decides on the refund
router.patch('/decision/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), validateRequest(adminRefundDecisionSchema), RefundControllers.adminRefundDecision);
export const RefundRoutes = router;
//# sourceMappingURL=refund.route.js.map
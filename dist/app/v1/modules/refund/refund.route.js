"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundRoutes = void 0;
const express_1 = __importDefault(require("express"));
const refund_controller_1 = require("./refund.controller");
const refund_validation_1 = require("./refund.validation");
const auth_1 = require("../../../../middleware/auth");
const user_interface_1 = require("../user/user.interface");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const router = express_1.default.Router();
// User requests refund for a specific parcel
router.post('/request/:parcelId', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(refund_validation_1.requestRefundSchema), refund_controller_1.RefundControllers.requestRefund);
// Admin lists all refund requests (optionally filtered by ?status=)
router.get('/', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), refund_controller_1.RefundControllers.getAllRefunds);
// Admin decides on the refund
router.patch('/decision/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(refund_validation_1.adminRefundDecisionSchema), refund_controller_1.RefundControllers.adminRefundDecision);
exports.RefundRoutes = router;
//# sourceMappingURL=refund.route.js.map
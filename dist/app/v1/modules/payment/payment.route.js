"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payment_controller_1 = require("./payment.controller");
const user_interface_1 = require("../user/user.interface");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const auth_1 = require("../../../../middleware/auth");
const payment_validation_1 = require("./payment.validation");
const dpo_payment_controller_1 = require("./dpo-payment.controller");
const router = express_1.default.Router();
/**
 * @route POST /api/payments/checkout
 * @desc Create Stripe checkout session for a parcel
 * @access CUSTOMER
 */
router.post('/checkout', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(payment_validation_1.createCheckoutSchema), payment_controller_1.createCheckoutSession);
/**
 * @route POST /api/payments/webhook/stripe
 * @desc Stripe webhook to handle payment status
 * @access Public (Stripe will call)
 */
router.post('/webhook/stripe', express_1.default.raw({ type: 'application/json' }), payment_controller_1.stripeWebhook);
/**
 * @route POST /api/v1/payments/dpo/checkout
 * @desc Create a DPO transaction and return the hosted payment page URL
 * @access CUSTOMER
 */
router.post('/dpo/checkout', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(payment_validation_1.createCheckoutSchema), dpo_payment_controller_1.createDpoCheckout);
/**
 * @route GET /api/v1/payments/dpo/callback
 * @desc DPO redirects the customer here after payment; verifies and redirects
 * @access Public (DPO will redirect the browser)
 */
router.get('/dpo/callback', dpo_payment_controller_1.dpoCallback);
/**
 * @route POST /api/payments/refund
 * @desc Refund a payment
 * @access ADMIN
 */
router.post('/refund', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN), (0, validate_request_1.default)(payment_validation_1.refundPaymentSchema), payment_controller_1.refundPayment);
/**
 * @route GET /api/payments/history
 * @desc Get payment history for the logged-in user
 * @access CUSTOMER
 */
router.get('/history', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), payment_controller_1.getPaymentHistory);
exports.PaymentRoute = router;
//# sourceMappingURL=payment.route.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.refundPayment = exports.stripeWebhook = exports.createCheckoutSession = void 0;
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const http_status_1 = __importDefault(require("http-status"));
const payment_service_1 = require("./payment.service");
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const stripe_1 = __importDefault(require("../../../../config/stripe"));
/**
 * POST /api/payments/checkout
 * Create Stripe checkout session for a parcel
 */
exports.createCheckoutSession = (0, catch_async_1.default)(async (req, res) => {
    const user = req.user;
    const { parcel_id } = req.body;
    if (!parcel_id)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel ID is required');
    const checkoutUrl = await (0, payment_service_1.createCheckoutSessionService)(user, parcel_id);
    res.status(http_status_1.default.OK).json({
        success: true,
        url: checkoutUrl,
    });
});
/**
 * POST /api/payments/webhook/stripe
 * Stripe webhook endpoint
 */
exports.stripeWebhook = (0, catch_async_1.default)(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    if (!sig) {
        return res.status(http_status_1.default.BAD_REQUEST).send('Missing Stripe signature');
    }
    let event;
    try {
        event = stripe_1.default.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        console.error('Stripe webhook error:', err.message);
        return res.status(http_status_1.default.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
    }
    await (0, payment_service_1.handleStripeWebhookService)(event);
    res.status(200).send({ received: true });
});
/**
 * POST /api/payments/refund
 * Refund a payment (ADMIN only)
 */
exports.refundPayment = (0, catch_async_1.default)(async (req, res) => {
    const { payment_id, reason } = req.body;
    if (!payment_id)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Payment ID is required');
    // reason must be one of the allowed Stripe values
    const validReasons = [
        'duplicate',
        'fraudulent',
        'requested_by_customer',
    ];
    const refundReason = validReasons.includes(reason) ? reason : 'requested_by_customer';
    const refund = await (0, payment_service_1.refundPaymentService)(payment_id, refundReason);
    res.status(http_status_1.default.OK).json({
        success: true,
        refund,
    });
});
/**
 * GET /api/payments/history
 * Get all payments for the current user
 */
exports.getPaymentHistory = (0, catch_async_1.default)(async (req, res) => {
    const user = req.user;
    const payments = await (0, payment_service_1.getPaymentHistoryService)(user.user_id);
    res.status(http_status_1.default.OK).json({
        success: true,
        payments,
    });
});
//# sourceMappingURL=payment.controller.js.map
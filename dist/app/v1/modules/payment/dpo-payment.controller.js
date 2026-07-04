"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dpoCallback = exports.verifyDpoPayment = exports.createDpoCheckout = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const dpo_payment_service_1 = require("./dpo-payment.service");
/**
 * POST /api/v1/payments/dpo/checkout
 * Create a DPO transaction and return the hosted payment page URL.
 */
exports.createDpoCheckout = (0, catch_async_1.default)(async (req, res) => {
    const user = req.user;
    const { parcel_id } = req.body;
    if (!parcel_id)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel ID is required');
    const result = await (0, dpo_payment_service_1.createDpoCheckoutService)(user, parcel_id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'DPO checkout created successfully',
        data: result,
    });
});
/**
 * POST /api/v1/payments/dpo/verify
 * JSON endpoint for the mobile app: after the customer returns from the DPO
 * WebView, the app calls this to confirm the payment server-to-server and get
 * a machine-readable status (instead of the browser redirect callback).
 */
exports.verifyDpoPayment = (0, catch_async_1.default)(async (req, res) => {
    const transToken = (req.body.token || req.body.transToken || '');
    const companyRef = (req.body.parcel_id ||
        req.body.companyRef ||
        '');
    if (!transToken && !companyRef)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'token or parcel_id is required');
    const result = await (0, dpo_payment_service_1.verifyDpoPaymentService)({ transToken, companyRef });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.paid
            ? 'Payment verified successfully'
            : 'Payment not completed',
        data: result,
    });
});
/**
 * GET /api/v1/payments/dpo/callback
 * Public endpoint DPO redirects the customer's browser to after payment.
 * Verifies the transaction server-to-server, then redirects to the frontend.
 */
exports.dpoCallback = (0, catch_async_1.default)(async (req, res) => {
    const transToken = (req.query.TransactionToken ||
        req.query.TransToken ||
        '');
    const companyRef = (req.query.CompanyRef || '');
    const successUrl = `${env_config_1.default.client_url}/payment-success`;
    const cancelUrl = `${env_config_1.default.client_url}/payment-cancel`;
    if (!transToken && !companyRef) {
        return res.redirect(cancelUrl);
    }
    try {
        const result = await (0, dpo_payment_service_1.verifyDpoPaymentService)({ transToken, companyRef });
        return res.redirect(result.paid ? successUrl : cancelUrl);
    }
    catch (error) {
        // Never surface a stack trace to the returning customer — send them to the
        // cancel page and log for diagnostics.
        console.error('[DPO] Callback verification error:', error);
        return res.redirect(cancelUrl);
    }
});
//# sourceMappingURL=dpo-payment.controller.js.map
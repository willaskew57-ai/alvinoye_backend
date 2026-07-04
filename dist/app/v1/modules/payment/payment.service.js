"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistoryService = exports.refundPaymentService = exports.handleStripeWebhookService = exports.createCheckoutSessionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const stripe_1 = __importDefault(require("../../../../config/stripe"));
const mongoose_1 = __importStar(require("mongoose"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const parcel_model_1 = require("../parcel/parcel.model");
const payment_model_1 = require("./payment.model");
const payment_constants_1 = require("./payment.constants");
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
/**
 * 1️⃣ Create Stripe Checkout Session for a Parcel
 */
const createCheckoutSessionService = async (user, parcelId) => {
    // Find parcel
    const parcel = await parcel_model_1.Parcel.findOne({
        _id: parcelId,
        user_id: user.user_id,
    });
    if (!parcel)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found');
    if (!parcel.final_price)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel price not set');
    // Check if payment already completed
    const existingPayment = await payment_model_1.Payment.findOne({
        parcel_id: parcel._id,
        user_id: parcel.user_id,
        status: payment_constants_1.PAYMENT_STATUS.SUCCESS,
    });
    if (existingPayment)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel already paid');
    // Create Stripe checkout session
    const session = await stripe_1.default.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: user.email,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Parcel Payment - ${parcel.parcel_name}` },
                    unit_amount: Math.round(parcel.final_price * 100),
                },
                quantity: 1,
            },
        ],
        metadata: { parcelId: parcel._id.toString(), userId: user.user_id },
        success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });
    if (!session.id)
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Stripe session ID missing');
    if (!session.url)
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Stripe checkout URL not generated');
    // Save Stripe session ID in Parcel
    parcel.stripe_checkout_session_id = session.id;
    await parcel.save();
    // Create payment record with PENDING status
    await payment_model_1.Payment.create({
        user_id: new mongoose_1.Types.ObjectId(user.user_id),
        parcel_id: parcel._id,
        transaction_id: session.id,
        transaction_amount: parcel.final_price,
        currency: 'usd',
        status: payment_constants_1.PAYMENT_STATUS.PENDING,
        payment_method: 'card',
    });
    return session.url;
};
exports.createCheckoutSessionService = createCheckoutSessionService;
/**
 * 2️⃣ Handle Stripe Webhook (checkout.session.completed)
 */
const handleStripeWebhookService = async (event) => {
    const session = event.data.object;
    // Only handle completed payments
    if (event.type !== 'checkout.session.completed')
        return;
    const parcelId = session.metadata?.parcelId;
    const userId = session.metadata?.userId;
    if (!parcelId || !userId)
        return;
    const dbSession = await mongoose_1.default.startSession();
    try {
        dbSession.startTransaction();
        // Update payment record
        const payment = await payment_model_1.Payment.findOne({ transaction_id: session.id }).session(dbSession);
        if (!payment) {
            await dbSession.abortTransaction();
            return;
        }
        payment.status = payment_constants_1.PAYMENT_STATUS.SUCCESS;
        await payment.save({ session: dbSession });
        // Optional: update Parcel to mark that payment was completed
        const parcel = await parcel_model_1.Parcel.findById(parcelId).session(dbSession);
        if (parcel) {
            parcel.stripe_checkout_session_id = session.id; // session confirmed
            parcel.is_paid = true;
            parcel.paid_at = new Date();
            await parcel.save({ session: dbSession });
        }
        await dbSession.commitTransaction();
        // Create notification for payment success
        try {
            if (userId && parcelId) {
                await notification_service_1.NotificationServices.createNotificationIntoDB({
                    user_id: userId,
                    type: notification_constant_1.NOTIFICATION_TYPE.PAYMENT_SUCCESS,
                    title: 'Payment Successful',
                    message: `Payment for parcel has been successful.`,
                    parcel_id: parcelId,
                    payment_id: payment._id,
                    data: {
                        amount: payment.transaction_amount,
                    },
                });
            }
        }
        catch (error) {
            console.error('Failed to create notification:', error);
        }
    }
    catch (error) {
        await dbSession.abortTransaction();
        throw error;
    }
    finally {
        await dbSession.endSession();
    }
};
exports.handleStripeWebhookService = handleStripeWebhookService;
/**
 * 3️⃣ Refund Payment
 */
const refundPaymentService = async (paymentId, reason) => {
    const payment = await payment_model_1.Payment.findById(paymentId);
    if (!payment)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Payment not found');
    if (payment.status !== payment_constants_1.PAYMENT_STATUS.SUCCESS) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Only successful payments can be refunded');
    }
    // Default reason if not provided
    const refundReason = reason || 'requested_by_customer';
    const refund = await stripe_1.default.refunds.create({
        payment_intent: payment.transaction_id,
        reason: refundReason,
    });
    payment.status = payment_constants_1.PAYMENT_STATUS.REFUNDED;
    payment.refund_id = refund.id;
    payment.refunded_at = new Date();
    await payment.save();
    return refund;
};
exports.refundPaymentService = refundPaymentService;
/**
 * 4️⃣ Optional: Get Payment History for a User
 */
const getPaymentHistoryService = async (userId) => {
    const payments = await payment_model_1.Payment.find({ user_id: userId })
        .populate('parcel_id', 'parcel_name final_price date time') // optional populate parcel details
        .sort({ created_at: -1 });
    return payments;
};
exports.getPaymentHistoryService = getPaymentHistoryService;
//# sourceMappingURL=payment.service.js.map
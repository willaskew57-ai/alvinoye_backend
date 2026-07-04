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
exports.verifyDpoPaymentService = exports.createDpoCheckoutService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importStar(require("mongoose"));
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const dpo_1 = require("../../../../config/dpo");
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const parcel_model_1 = require("../parcel/parcel.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const payment_model_1 = require("./payment.model");
const payment_constants_1 = require("./payment.constants");
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
/** Format a Date as DPO expects: "YYYY/MM/DD HH:MM". */
const formatDpoDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
/**
 * 1️⃣ Create a DPO transaction token for a parcel and return the hosted
 * payment page URL the customer should be redirected to.
 */
const createDpoCheckoutService = async (user, parcelId) => {
    const parcel = await parcel_model_1.Parcel.findOne({
        _id: parcelId,
        user_id: user.user_id,
    });
    if (!parcel)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found');
    if (!parcel.final_price)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel price not set');
    // Block double payment.
    const existingPayment = await payment_model_1.Payment.findOne({
        parcel_id: parcel._id,
        user_id: parcel.user_id,
        status: payment_constants_1.PAYMENT_STATUS.SUCCESS,
    });
    if (existingPayment)
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel already paid');
    const amount = parcel.final_price.toFixed(2);
    const serviceDate = formatDpoDate(new Date());
    // Load the payer's profile so DPO fraud screening has real customer data.
    const dbUser = await user_model_1.default.findById(user.user_id).select('full_name email phone_number address');
    const fullName = (dbUser?.full_name || '').trim();
    const spaceIdx = fullName.indexOf(' ');
    const firstName = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
    const lastName = spaceIdx === -1 ? '' : fullName.slice(spaceIdx + 1).trim();
    const email = dbUser?.email || user.email || '';
    const phone = dbUser?.phone_number || '';
    const address = dbUser?.address || '';
    // Only emit customer tags that actually have a value (empty tags can
    // themselves trip fraud rules).
    const customerTag = (tag, value) => value ? `    <${tag}>${(0, dpo_1.xmlEscape)(value)}</${tag}>\n` : '';
    const customerXml = customerTag('customerEmail', email) +
        customerTag('customerFirstName', firstName) +
        customerTag('customerLastName', lastName) +
        customerTag('customerPhone', phone) +
        customerTag('customerAddress', address) +
        customerTag('customerCountry', env_config_1.default.dpo_country);
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_company_token)}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${(0, dpo_1.xmlEscape)(amount)}</PaymentAmount>
    <PaymentCurrency>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_currency)}</PaymentCurrency>
    <CompanyRef>${(0, dpo_1.xmlEscape)(parcel._id.toString())}</CompanyRef>
    <RedirectURL>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_redirect_url)}</RedirectURL>
    <BackURL>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_redirect_url)}</BackURL>
${customerXml}  </Transaction>
  <Services>
    <Service>
      <ServiceType>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_service_type)}</ServiceType>
      <ServiceDescription>${(0, dpo_1.xmlEscape)(`Parcel Payment - ${parcel.parcel_name}`)}</ServiceDescription>
      <ServiceDate>${(0, dpo_1.xmlEscape)(serviceDate)}</ServiceDate>
    </Service>
  </Services>
</API3G>`;
    const response = await (0, dpo_1.postToDpo)(xml);
    if (response.Result !== dpo_1.DPO_RESULT.PAID || !response.TransToken) {
        console.error('[DPO] createToken failed:', response.Result, response.ResultExplanation);
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, response.ResultExplanation || 'Failed to initialize payment');
    }
    const token = response.TransToken;
    // Persist a PENDING payment keyed by the DPO token (unique transaction_id).
    await payment_model_1.Payment.create({
        user_id: new mongoose_1.Types.ObjectId(user.user_id),
        parcel_id: parcel._id,
        transaction_id: token,
        dpo_trans_ref: response.TransRef ?? null,
        transaction_amount: parcel.final_price,
        currency: env_config_1.default.dpo_currency,
        status: payment_constants_1.PAYMENT_STATUS.PENDING,
        payment_method: 'dpo',
        gateway: 'dpo',
    });
    return {
        url: `${env_config_1.default.dpo_payment_url}?ID=${encodeURIComponent(token)}`,
        token,
    };
};
exports.createDpoCheckoutService = createDpoCheckoutService;
/**
 * 2️⃣ Verify a DPO transaction (called when the customer returns via the
 * redirect/back URL). Confirms the payment server-to-server with DPO and
 * updates the local Payment record. Idempotent.
 */
const verifyDpoPaymentService = async (params) => {
    // Resolve the payment either by the DPO token or by CompanyRef (parcel id),
    // since DPO's redirect may carry either one back to us.
    let payment = null;
    if (params.transToken) {
        payment = await payment_model_1.Payment.findOne({
            transaction_id: params.transToken,
            gateway: 'dpo',
        });
    }
    if (!payment && params.companyRef) {
        payment = await payment_model_1.Payment.findOne({
            parcel_id: params.companyRef,
            gateway: 'dpo',
        }).sort({ created_at: -1 });
    }
    if (!payment)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Payment record not found');
    const transToken = payment.transaction_id;
    // Already finalized — return current state without re-processing.
    if (payment.status === payment_constants_1.PAYMENT_STATUS.SUCCESS) {
        return { status: payment_constants_1.PAYMENT_STATUS.SUCCESS, paid: true };
    }
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${(0, dpo_1.xmlEscape)(env_config_1.default.dpo_company_token)}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${(0, dpo_1.xmlEscape)(transToken)}</TransactionToken>
</API3G>`;
    const response = await (0, dpo_1.postToDpo)(xml);
    const resultCode = response.Result;
    const isPaid = resultCode === dpo_1.DPO_RESULT.PAID;
    if (!isPaid) {
        // Anything that is not "paid" and not still "pending at gateway" is failed.
        if (resultCode !== dpo_1.DPO_RESULT.NOT_PAID_YET) {
            payment.status = payment_constants_1.PAYMENT_STATUS.FAILED;
            await payment.save();
            try {
                await notification_service_1.NotificationServices.createNotificationIntoDB({
                    user_id: payment.user_id.toString(),
                    type: notification_constant_1.NOTIFICATION_TYPE.PAYMENT_FAILED,
                    title: 'Payment Failed',
                    message: 'Your payment could not be completed.',
                    parcel_id: payment.parcel_id.toString(),
                    payment_id: payment._id,
                    data: { amount: payment.transaction_amount },
                });
            }
            catch (error) {
                console.error('[DPO] Failed to create failure notification:', error);
            }
        }
        return {
            status: payment.status,
            paid: false,
            resultCode,
            resultExplanation: response.ResultExplanation,
        };
    }
    // Paid — mark success atomically (payment + parcel) like the Stripe flow.
    const dbSession = await mongoose_1.default.startSession();
    try {
        dbSession.startTransaction();
        const lockedPayment = await payment_model_1.Payment.findById(payment._id).session(dbSession);
        if (!lockedPayment) {
            await dbSession.abortTransaction();
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Payment record not found');
        }
        // Re-check inside the transaction to stay idempotent under concurrency.
        if (lockedPayment.status === payment_constants_1.PAYMENT_STATUS.SUCCESS) {
            await dbSession.abortTransaction();
            return { status: payment_constants_1.PAYMENT_STATUS.SUCCESS, paid: true };
        }
        lockedPayment.status = payment_constants_1.PAYMENT_STATUS.SUCCESS;
        await lockedPayment.save({ session: dbSession });
        // Mark the parcel as paid so it becomes visible to drivers.
        await parcel_model_1.Parcel.updateOne({ _id: lockedPayment.parcel_id }, { $set: { is_paid: true, paid_at: new Date() } }, { session: dbSession });
        await dbSession.commitTransaction();
    }
    catch (error) {
        await dbSession.abortTransaction();
        throw error;
    }
    finally {
        await dbSession.endSession();
    }
    try {
        await notification_service_1.NotificationServices.createNotificationIntoDB({
            user_id: payment.user_id.toString(),
            type: notification_constant_1.NOTIFICATION_TYPE.PAYMENT_SUCCESS,
            title: 'Payment Successful',
            message: 'Payment for parcel has been successful.',
            parcel_id: payment.parcel_id.toString(),
            payment_id: payment._id,
            data: { amount: payment.transaction_amount },
        });
    }
    catch (error) {
        console.error('[DPO] Failed to create success notification:', error);
    }
    return { status: payment_constants_1.PAYMENT_STATUS.SUCCESS, paid: true, resultCode };
};
exports.verifyDpoPaymentService = verifyDpoPaymentService;
//# sourceMappingURL=dpo-payment.service.js.map
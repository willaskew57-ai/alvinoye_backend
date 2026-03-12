import mongoose, { Types } from 'mongoose';
import type { TUserPayload } from '../../../../interfaces';
/**
 * 1️⃣ Create Stripe Checkout Session for a Parcel
 */
export declare const createCheckoutSessionService: (user: TUserPayload, parcelId: string) => Promise<string>;
/**
 * 2️⃣ Handle Stripe Webhook (checkout.session.completed)
 */
export declare const handleStripeWebhookService: (event: any) => Promise<void>;
/**
 * 3️⃣ Refund Payment
 */
export declare const refundPaymentService: (paymentId: string, reason?: "duplicate" | "fraudulent" | "requested_by_customer") => Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Refund>>;
/**
 * 4️⃣ Optional: Get Payment History for a User
 */
export declare const getPaymentHistoryService: (userId: string) => Promise<(mongoose.Document<unknown, {}, import("./payment.interface").TPayment, {}, mongoose.DefaultSchemaOptions> & import("./payment.interface").TPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
//# sourceMappingURL=payment.service.d.ts.map
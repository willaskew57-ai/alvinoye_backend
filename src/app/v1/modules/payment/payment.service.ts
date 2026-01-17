import httpStatus from 'http-status';
import stripe from '../../../../config/stripe';
import { Types } from 'mongoose';
import AppError from '../../../../errors/app-error';

import { Parcel } from '../parcel/parcel.model';
import { Payment } from './payment.model';
import { PAYMENT_STATUS } from './payment.constants';
import type { TUserPayload } from '../../../../interfaces';

/**
 * 1️⃣ Create Stripe Checkout Session for a Parcel
 */
export const createCheckoutSessionService = async (
  user: TUserPayload,
  parcelId: string
): Promise<string> => {
  // Find parcel
  const parcel = await Parcel.findOne({
    _id: parcelId,
    user_id: user.user_id,
  });

  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  if (!parcel.final_price)
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel price not set');

  // Check if payment already completed
  const existingPayment = await Payment.findOne({
    parcel_id: parcel._id,
    user_id: parcel.user_id,
    status: PAYMENT_STATUS.SUCCESS,
  });

  if (existingPayment)
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel already paid');

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
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
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Stripe session ID missing'
    );
  if (!session.url)
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Stripe checkout URL not generated'
    );

  // Save Stripe session ID in Parcel
  parcel.stripe_checkout_session_id = session.id;
  await parcel.save();

  // Create payment record with PENDING status
  await Payment.create({
    user_id: new Types.ObjectId(user.user_id),
    parcel_id: parcel._id,
    transaction_id: session.id,
    transaction_amount: parcel.final_price,
    currency: 'usd',
    status: PAYMENT_STATUS.PENDING,
    payment_method: 'card',
  });

  return session.url;
};

/**
 * 2️⃣ Handle Stripe Webhook (checkout.session.completed)
 */
export const handleStripeWebhookService = async (event: any) => {
  const session = event.data.object;

  // Only handle completed payments
  if (event.type !== 'checkout.session.completed') return;

  const parcelId = session.metadata?.parcelId;
  const userId = session.metadata?.userId;

  if (!parcelId || !userId) return;

  // Update payment record
  const payment = await Payment.findOne({ transaction_id: session.id });
  if (!payment) return;

  payment.status = PAYMENT_STATUS.SUCCESS;
  await payment.save();

  // Optional: update Parcel to mark that payment was completed
  const parcel = await Parcel.findById(parcelId);
  if (parcel) {
    parcel.stripe_checkout_session_id = session.id; // session confirmed
    await parcel.save();
  }
};

/**
 * 3️⃣ Refund Payment
 */
export const refundPaymentService = async (
  paymentId: string,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');

  if (payment.status !== PAYMENT_STATUS.SUCCESS) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only successful payments can be refunded'
    );
  }

  // Default reason if not provided
  const refundReason = reason || 'requested_by_customer';

  const refund = await stripe.refunds.create({
    payment_intent: payment.transaction_id,
    reason: refundReason,
  });

  payment.status = PAYMENT_STATUS.REFUNDED;
  payment.refund_id = refund.id;
  payment.refunded_at = new Date();
  await payment.save();

  return refund;
};

/**
 * 4️⃣ Optional: Get Payment History for a User
 */
export const getPaymentHistoryService = async (userId: string) => {
  const payments = await Payment.find({ user_id: userId })
    .populate('parcel_id', 'parcel_name final_price date time') // optional populate parcel details
    .sort({ created_at: -1 });
  return payments;
};

import type { Request, Response } from 'express';
import AppError from '../../../../errors/app-error';
import httpStatus from 'http-status';

import {
  createCheckoutSessionService,
  handleStripeWebhookService,
  refundPaymentService,
  getPaymentHistoryService,
} from './payment.service';
import { PAYMENT_STATUS } from './payment.constants';
import catchAsync from '../../../../utils/catch-async';
import stripe from '../../../../config/stripe';

/**
 * POST /api/payments/checkout
 * Create Stripe checkout session for a parcel
 */
export const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const {  parcel_id } = req.body;


  if (!parcel_id) throw new AppError(httpStatus.BAD_REQUEST, 'Parcel ID is required');

  const checkoutUrl = await createCheckoutSessionService(user, parcel_id);

  res.status(httpStatus.OK).json({
    success: true,
    url: checkoutUrl,
  });
});

/**
 * POST /api/payments/webhook/stripe
 * Stripe webhook endpoint
 */
export const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(httpStatus.BAD_REQUEST).send('Missing Stripe signature');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error('Stripe webhook error:', err.message);
    return res.status(httpStatus.BAD_REQUEST).send(`Webhook Error: ${err.message}`);
  }

  await handleStripeWebhookService(event);

  res.status(200).send({ received: true });
});

/**
 * POST /api/payments/refund
 * Refund a payment (ADMIN only)
 */
export const refundPayment = catchAsync(async (req: Request, res: Response) => {
  const { paymentId, reason } = req.body;

  if (!paymentId) throw new AppError(httpStatus.BAD_REQUEST, 'Payment ID is required');

  // reason must be one of the allowed Stripe values
  const validReasons: Array<'duplicate' | 'fraudulent' | 'requested_by_customer'> = [
    'duplicate',
    'fraudulent',
    'requested_by_customer',
  ];

  const refundReason = validReasons.includes(reason) ? reason : 'requested_by_customer';

  const refund = await refundPaymentService(paymentId, refundReason);

  res.status(httpStatus.OK).json({
    success: true,
    refund,
  });
});

/**
 * GET /api/payments/history
 * Get all payments for the current user
 */
export const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const payments = await getPaymentHistoryService(user.userId);

  res.status(httpStatus.OK).json({
    success: true,
    payments,
  });
});

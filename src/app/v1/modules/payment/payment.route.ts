import express from 'express';

import {
  createCheckoutSession,
  stripeWebhook,
  refundPayment,
  getPaymentHistory,
} from './payment.controller';
import { USER_ROLE } from '../user/user.interface';
import validateRequest from '../../../../middleware/validate-request';
import { auth } from '../../../../middleware/auth';
import {
  createCheckoutSchema,
  refundPaymentSchema,
} from './payment.validation';
import {
  createDpoCheckout,
  dpoCallback,
} from './dpo-payment.controller';

const router = express.Router();

/**
 * @route POST /api/payments/checkout
 * @desc Create Stripe checkout session for a parcel
 * @access CUSTOMER
 */
router.post(
  '/checkout',
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createCheckoutSchema),
  createCheckoutSession
);

/**
 * @route POST /api/payments/webhook/stripe
 * @desc Stripe webhook to handle payment status
 * @access Public (Stripe will call)
 */
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

/**
 * @route POST /api/v1/payments/dpo/checkout
 * @desc Create a DPO transaction and return the hosted payment page URL
 * @access CUSTOMER
 */
router.post(
  '/dpo/checkout',
  auth(USER_ROLE.CUSTOMER),
  validateRequest(createCheckoutSchema),
  createDpoCheckout
);

/**
 * @route GET /api/v1/payments/dpo/callback
 * @desc DPO redirects the customer here after payment; verifies and redirects
 * @access Public (DPO will redirect the browser)
 */
router.get('/dpo/callback', dpoCallback);

/**
 * @route POST /api/payments/refund
 * @desc Refund a payment
 * @access ADMIN
 */
router.post(
  '/refund',
  auth(USER_ROLE.ADMIN),
  validateRequest(refundPaymentSchema),
  refundPayment
);

/**
 * @route GET /api/payments/history
 * @desc Get payment history for the logged-in user
 * @access CUSTOMER
 */
router.get('/history', auth(USER_ROLE.CUSTOMER), getPaymentHistory);

export const PaymentRoute = router;

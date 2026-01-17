import Stripe from 'stripe';
import config from './index';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-12-15.clover',
});

export default stripe;

export const STRIPE_EVENTS = {
  CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
  PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
  PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
} as const;

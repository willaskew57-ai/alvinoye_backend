import Stripe from 'stripe';
import config from './env.config';
const stripe = new Stripe(config.stripe_secret_key, {
    apiVersion: '2026-01-28.clover',
});
export default stripe;
export const STRIPE_EVENTS = {
    CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
    PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
    PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
    PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
};
//# sourceMappingURL=stripe.js.map
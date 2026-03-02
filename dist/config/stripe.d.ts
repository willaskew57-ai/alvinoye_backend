import Stripe from 'stripe';
declare const stripe: Stripe;
export default stripe;
export declare const STRIPE_EVENTS: {
    readonly CHECKOUT_SESSION_COMPLETED: "checkout.session.completed";
    readonly PAYMENT_INTENT_SUCCEEDED: "payment_intent.succeeded";
    readonly PAYMENT_INTENT_FAILED: "payment_intent.payment_failed";
    readonly PAYMENT_INTENT_CANCELED: "payment_intent.canceled";
};
//# sourceMappingURL=stripe.d.ts.map
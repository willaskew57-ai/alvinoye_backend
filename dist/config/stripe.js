"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_EVENTS = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = __importDefault(require("./env.config"));
const stripe = new stripe_1.default(env_config_1.default.stripe_secret_key, {
    apiVersion: '2026-02-25.clover',
});
exports.default = stripe;
exports.STRIPE_EVENTS = {
    CHECKOUT_SESSION_COMPLETED: 'checkout.session.completed',
    PAYMENT_INTENT_SUCCEEDED: 'payment_intent.succeeded',
    PAYMENT_INTENT_FAILED: 'payment_intent.payment_failed',
    PAYMENT_INTENT_CANCELED: 'payment_intent.canceled',
};
//# sourceMappingURL=stripe.js.map
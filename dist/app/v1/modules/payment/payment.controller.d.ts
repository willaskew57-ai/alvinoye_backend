import type { Request, Response } from 'express';
/**
 * POST /api/payments/checkout
 * Create Stripe checkout session for a parcel
 */
export declare const createCheckoutSession: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/payments/webhook/stripe
 * Stripe webhook endpoint
 */
export declare const stripeWebhook: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/payments/refund
 * Refund a payment (ADMIN only)
 */
export declare const refundPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/payments/history
 * Get all payments for the current user
 */
export declare const getPaymentHistory: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=payment.controller.d.ts.map
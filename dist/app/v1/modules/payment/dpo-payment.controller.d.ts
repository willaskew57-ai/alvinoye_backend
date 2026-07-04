import type { Request, Response } from 'express';
/**
 * POST /api/v1/payments/dpo/checkout
 * Create a DPO transaction and return the hosted payment page URL.
 */
export declare const createDpoCheckout: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * POST /api/v1/payments/dpo/verify
 * JSON endpoint for the mobile app: after the customer returns from the DPO
 * WebView, the app calls this to confirm the payment server-to-server and get
 * a machine-readable status (instead of the browser redirect callback).
 */
export declare const verifyDpoPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * GET /api/v1/payments/dpo/callback
 * Public endpoint DPO redirects the customer's browser to after payment.
 * Verifies the transaction server-to-server, then redirects to the frontend.
 */
export declare const dpoCallback: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=dpo-payment.controller.d.ts.map
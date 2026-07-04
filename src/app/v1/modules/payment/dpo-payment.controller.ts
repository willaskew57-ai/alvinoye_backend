import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import AppError from '../../../../errors/app-error';
import config from '../../../../config/env.config';
import {
  createDpoCheckoutService,
  verifyDpoPaymentService,
} from './dpo-payment.service';

/**
 * POST /api/v1/payments/dpo/checkout
 * Create a DPO transaction and return the hosted payment page URL.
 */
export const createDpoCheckout = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { parcel_id } = req.body;

    if (!parcel_id)
      throw new AppError(httpStatus.BAD_REQUEST, 'Parcel ID is required');

    const result = await createDpoCheckoutService(user, parcel_id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'DPO checkout created successfully',
      data: result,
    });
  }
);

/**
 * POST /api/v1/payments/dpo/verify
 * JSON endpoint for the mobile app: after the customer returns from the DPO
 * WebView, the app calls this to confirm the payment server-to-server and get
 * a machine-readable status (instead of the browser redirect callback).
 */
export const verifyDpoPayment = catchAsync(
  async (req: Request, res: Response) => {
    const transToken = (req.body.token || req.body.transToken || '') as string;
    const companyRef = (req.body.parcel_id ||
      req.body.companyRef ||
      '') as string;

    if (!transToken && !companyRef)
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'token or parcel_id is required'
      );

    const result = await verifyDpoPaymentService({ transToken, companyRef });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.paid
        ? 'Payment verified successfully'
        : 'Payment not completed',
      data: result,
    });
  }
);

/**
 * GET /api/v1/payments/dpo/callback
 * Public endpoint DPO redirects the customer's browser to after payment.
 * Verifies the transaction server-to-server, then redirects to the frontend.
 */
export const dpoCallback = catchAsync(async (req: Request, res: Response) => {
  const transToken = (req.query.TransactionToken ||
    req.query.TransToken ||
    '') as string;
  const companyRef = (req.query.CompanyRef || '') as string;

  const successUrl = `${config.client_url}/payment-success`;
  const cancelUrl = `${config.client_url}/payment-cancel`;

  if (!transToken && !companyRef) {
    return res.redirect(cancelUrl);
  }

  try {
    const result = await verifyDpoPaymentService({ transToken, companyRef });
    return res.redirect(result.paid ? successUrl : cancelUrl);
  } catch (error) {
    // Never surface a stack trace to the returning customer — send them to the
    // cancel page and log for diagnostics.
    console.error('[DPO] Callback verification error:', error);
    return res.redirect(cancelUrl);
  }
});

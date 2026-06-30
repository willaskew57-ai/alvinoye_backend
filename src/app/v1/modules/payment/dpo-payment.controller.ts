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
 * GET /api/v1/payments/dpo/callback
 * Public endpoint DPO redirects the customer's browser to after payment.
 * Verifies the transaction server-to-server, then redirects to the frontend.
 */
export const dpoCallback = catchAsync(async (req: Request, res: Response) => {
  const transToken = (req.query.TransactionToken ||
    req.query.TransToken ||
    '') as string;

  const successUrl = `${config.client_url}/payment-success`;
  const cancelUrl = `${config.client_url}/payment-cancel`;

  if (!transToken) {
    return res.redirect(cancelUrl);
  }

  try {
    const result = await verifyDpoPaymentService(transToken);
    return res.redirect(result.paid ? successUrl : cancelUrl);
  } catch (error) {
    // Never surface a stack trace to the returning customer — send them to the
    // cancel page and log for diagnostics.
    console.error('[DPO] Callback verification error:', error);
    return res.redirect(cancelUrl);
  }
});

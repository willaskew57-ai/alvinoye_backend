import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { WalletServices } from './wallet.service';

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getMyWallet(req.user.user_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet retrieved successfully',
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getMyTransactions(
    req.user.user_id,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Wallet transactions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const withdraw = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.requestWithdrawal(
    req.user.user_id,
    Number(req.body.amount)
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdrawal request submitted successfully',
    data: result,
  });
});

const getMyWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getMyWithdrawals(
    req.user.user_id,
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdrawals retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// ** ---------- Admin ----------

const getAllWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.getAllWithdrawals(
    req.query as Record<string, unknown>
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Withdrawals retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const retryPayout = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.retryPayout(req.params.id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payout retry attempted',
    data: result,
  });
});

const getCommission = catchAsync(async (_req: Request, res: Response) => {
  const result = await WalletServices.getCommission();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission retrieved successfully',
    data: result,
  });
});

const updateCommission = catchAsync(async (req: Request, res: Response) => {
  const result = await WalletServices.updateCommission(
    Number(req.body.percentage)
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Commission updated successfully',
    data: result,
  });
});

export const WalletController = {
  getMyWallet,
  getMyTransactions,
  withdraw,
  getMyWithdrawals,
  getAllWithdrawals,
  retryPayout,
  getCommission,
  updateCommission,
};

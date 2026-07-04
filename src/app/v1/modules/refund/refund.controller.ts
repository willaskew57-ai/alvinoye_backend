import httpStatus from 'http-status';
import { RefundServices } from './refund.service';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';

const requestRefund = catchAsync(async (req, res) => {
  const { parcelId } = req.params;
  const { reason } = req.body;
  const userId = req.user.user_id;

  const result = await RefundServices.createRefundRequest(userId, parcelId as string, reason);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Refund request submitted successfully',
    data: result,
  });
});

const getAllRefunds = catchAsync(async (req, res) => {
  const result = await RefundServices.getAllRefundsFromDB(
    req.query as Record<string, unknown>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Refund requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const adminRefundDecision = catchAsync(async (req, res) => {
  const { id } = req.params; // Request ID
  const result = await RefundServices.processRefundDecision(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Refund request ${req.body.action.toLowerCase()}ed successfully`,
    data: result,
  });
});

export const RefundControllers = {
  requestRefund,
  getAllRefunds,
  adminRefundDecision,
};
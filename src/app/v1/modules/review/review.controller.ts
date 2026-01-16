import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { ReviewService } from './review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.createReview(req.user.user_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully!',
    data: result,
  });
});

const getDriverReviews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = id as string;

  const result = await ReviewService.getDriverReviews(driverId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver reviews retrieved successfully!',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getDriverReviews,
};
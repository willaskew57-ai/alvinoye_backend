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

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewService.getSingleReviewFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieved successfully!',
    data: result,
  });
});

const getDriverReviews = catchAsync(async (req: Request, res: Response) => {
  const { user_id } = req.user;
  const driverId = user_id as string;

  const { meta, average_rating, result } = await ReviewService.getDriverReviewsFromDB(
    driverId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver reviews retrieved successfully!',
    average_rating: average_rating,
    meta: meta, 
    data: result,
  });
  
});

export const ReviewController = {
  createReview,
  getSingleReview,
  getDriverReviews,
};

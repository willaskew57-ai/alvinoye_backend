import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { ReviewService } from './review.service';
const createReview = catchAsync(async (req, res) => {
    const result = await ReviewService.createReview(req.user.user_id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Review submitted successfully!',
        data: result,
    });
});
const getSingleReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ReviewService.getSingleReviewFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review retrieved successfully!',
        data: result,
    });
});
const getDriverReviews = catchAsync(async (req, res) => {
    const { user_id } = req.user;
    const driverId = user_id;
    const { meta, average_rating, result } = await ReviewService.getDriverReviewsFromDB(driverId, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Driver reviews retrieved successfully!',
        average_rating: average_rating,
        meta: meta,
        data: result,
    });
});
const getCustomerReviews = catchAsync(async (req, res) => {
    const { user_id } = req.user;
    const customerId = user_id;
    const { meta, result } = await ReviewService.getCustomerReviewsFromDB(customerId, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer reviews retrieved successfully!',
        meta: meta,
        data: result,
    });
});
export const ReviewController = {
    createReview,
    getSingleReview,
    getDriverReviews,
    getCustomerReviews
};
//# sourceMappingURL=review.controller.js.map
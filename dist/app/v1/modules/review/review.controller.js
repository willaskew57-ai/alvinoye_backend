"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const review_service_1 = require("./review.service");
const createReview = (0, catch_async_1.default)(async (req, res) => {
    const result = await review_service_1.ReviewService.createReview(req.user.user_id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Review submitted successfully!',
        data: result,
    });
});
const getSingleReview = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await review_service_1.ReviewService.getSingleReviewFromDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Review retrieved successfully!',
        data: result,
    });
});
const getDriverReviews = (0, catch_async_1.default)(async (req, res) => {
    const { user_id } = req.user;
    const driverId = user_id;
    const { meta, average_rating, result } = await review_service_1.ReviewService.getDriverReviewsFromDB(driverId, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver reviews retrieved successfully!',
        average_rating: average_rating,
        meta: meta,
        data: result,
    });
});
const getCustomerReviews = (0, catch_async_1.default)(async (req, res) => {
    const { user_id } = req.user;
    const customerId = user_id;
    const { meta, result } = await review_service_1.ReviewService.getCustomerReviewsFromDB(customerId, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Customer reviews retrieved successfully!',
        meta: meta,
        data: result,
    });
});
exports.ReviewController = {
    createReview,
    getSingleReview,
    getDriverReviews,
    getCustomerReviews
};
//# sourceMappingURL=review.controller.js.map
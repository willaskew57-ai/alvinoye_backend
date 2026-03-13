"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const parcel_model_1 = require("../parcel/parcel.model");
const review_model_1 = require("./review.model");
const parcel_interface_1 = require("../parcel/parcel.interface");
const user_model_1 = __importDefault(require("../user/user.model"));
const createReview = async (customerId, payload) => {
    const parcel = await parcel_model_1.Parcel.findById(payload.parcel_id);
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.status !== parcel_interface_1.PARCEL_STATUS.COMPLETED) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Cannot review a parcel that is not yet completed.');
    }
    if (parcel.user_id.toString() !== customerId) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'You can only review your own delivered parcels');
    }
    if (!parcel.accepted_by) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This parcel was never accepted by a driver');
    }
    const result = await review_model_1.Review.create({
        parcel_id: new mongoose_1.Types.ObjectId(payload.parcel_id),
        customer_id: new mongoose_1.Types.ObjectId(customerId),
        driver_id: parcel.accepted_by,
        rating: payload.rating,
        feedback: payload.feedback,
    });
    return result;
};
const getSingleReviewFromDB = async (review_id) => {
    if (!mongoose_1.Types.ObjectId.isValid(review_id)) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Invalid Review ID');
    }
    const result = await review_model_1.Review.findById(review_id).populate('customer_id', 'full_name profile_picture');
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Review not found');
    }
    return result;
};
const getDriverReviewsFromDB = async (driverId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { driver_id: new mongoose_1.Types.ObjectId(driverId) };
    if (query.searchTerm) {
        const searchTerm = query.searchTerm;
        const matchingUsers = await user_model_1.default.find({
            full_name: { $regex: searchTerm, $options: 'i' },
        }).select('_id');
        const userIds = matchingUsers.map((user) => user._id);
        filter.customer_id = { $in: userIds };
    }
    const result = await review_model_1.Review.find(filter)
        .populate('customer_id', 'full_name profile_picture')
        .sort('-created_at')
        .skip(skip)
        .limit(limit);
    const stats = await review_model_1.Review.aggregate([
        {
            $match: { driver_id: new mongoose_1.Types.ObjectId(driverId) },
        },
        {
            $group: {
                _id: '$driver_id',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
            },
        },
    ]);
    const average_rating = stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0;
    const total = stats.length > 0 ? stats[0].totalReviews : 0;
    const totalPages = Math.ceil(total / limit);
    const meta = {
        total,
        page,
        limit,
        totalPages,
    };
    return {
        meta,
        average_rating,
        result,
    };
};
const getCustomerReviewsFromDB = async (customerId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { customer_id: new mongoose_1.Types.ObjectId(customerId) };
    if (query.searchTerm) {
        const searchTerm = query.searchTerm;
        const matchingDrivers = await user_model_1.default.find({
            full_name: { $regex: searchTerm, $options: 'i' },
        }).select('_id');
        const driverIds = matchingDrivers.map((driver) => driver._id);
        filter.driver_id = { $in: driverIds };
    }
    const result = await review_model_1.Review.find(filter)
        .populate('driver_id', 'full_name profile_picture')
        .populate('parcel_id', 'pickup_address dropoff_address status') // Add or remove parcel fields as needed
        .sort('-created_at')
        .skip(skip)
        .limit(limit);
    const total = await review_model_1.Review.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const meta = {
        total,
        page,
        limit,
        totalPages,
    };
    return {
        meta,
        result,
    };
};
exports.ReviewService = {
    createReview,
    getSingleReviewFromDB,
    getDriverReviewsFromDB,
    getCustomerReviewsFromDB,
};
//# sourceMappingURL=review.service.js.map
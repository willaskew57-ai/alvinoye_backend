import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../../../errors/app-error';
import { Parcel } from '../parcel/parcel.model';
import { Review } from './review.model';
import { PARCEL_STATUS } from '../parcel/parcel.interface';
import User from '../user/user.model';

const createReview = async (
  customerId: string,
  payload: { parcel_id: string; rating: number; feedback: string }
) => {
  const parcel = await Parcel.findById(payload.parcel_id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  if (parcel.status !== PARCEL_STATUS.COMPLETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot review a parcel that is not yet completed.'
    );
  }

  if (parcel.user_id.toString() !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only review your own delivered parcels'
    );
  }

  if (!parcel.accepted_by) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This parcel was never accepted by a driver'
    );
  }

  const result = await Review.create({
    parcel_id: new Types.ObjectId(payload.parcel_id),
    customer_id: new Types.ObjectId(customerId),
    driver_id: parcel.accepted_by,
    rating: payload.rating,
    feedback: payload.feedback,
  });

  return result;
};

const getSingleReviewFromDB = async (review_id: string) => {
  if (!Types.ObjectId.isValid(review_id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Review ID');
  }

  const result = await Review.findById(review_id).populate(
    'customer_id',
    'full_name profile_picture'
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  return result;
};

const getDriverReviewsFromDB = async (
  driverId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = { driver_id: new Types.ObjectId(driverId) };

  if (query.searchTerm) {
    const searchTerm = query.searchTerm as string;
    const matchingUsers = await User.find({
      full_name: { $regex: searchTerm, $options: 'i' },
    } as any).select('_id');

    const userIds = matchingUsers.map((user) => user._id);
    filter.customer_id = { $in: userIds };
  }

  const result = await Review.find(filter)
    .populate('customer_id', 'full_name profile_picture')
    .sort('-created_at')
    .skip(skip)
    .limit(limit);

  const stats = await Review.aggregate([
    {
      $match: { driver_id: new Types.ObjectId(driverId) },
    },
    {
      $group: {
        _id: '$driver_id',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const average_rating =
    stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0;
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

const getCustomerReviewsFromDB = async (
  customerId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: any = { customer_id: new Types.ObjectId(customerId) };

  if (query.searchTerm) {
    const searchTerm = query.searchTerm as string;
    const matchingDrivers = await User.find({
      full_name: { $regex: searchTerm, $options: 'i' },
    } as any).select('_id');

    const driverIds = matchingDrivers.map((driver) => driver._id);
    filter.driver_id = { $in: driverIds };
  }

  const result = await Review.find(filter)
    .populate('driver_id', 'full_name profile_picture')
    .populate('parcel_id', 'pickup_address dropoff_address status') // Add or remove parcel fields as needed
    .sort('-created_at')
    .skip(skip)
    .limit(limit);

  const total = await Review.countDocuments(filter);
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

export const ReviewService = {
  createReview,
  getSingleReviewFromDB,
  getDriverReviewsFromDB,
  getCustomerReviewsFromDB,
};

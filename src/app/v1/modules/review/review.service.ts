import httpStatus from 'http-status';
import { Types } from 'mongoose';
import AppError from '../../../../errors/app-error';
import { Parcel } from '../parcel/parcel.model';
import { Review } from './review.model';

const createReview = async (
  customerId: string,
  payload: { parcel_id: string; rating: number; feedback: string }
) => {
  // 1. Check if the parcel exists
  const parcel = await Parcel.findById(payload.parcel_id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  // 2. Security: Ensure this customer owns the parcel
  if (parcel.user_id.toString() !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You can only review your own delivered parcels'
    );
  }

  // 3. Ensure the parcel was accepted by a driver
  if (!parcel.accepted_by) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This parcel was never accepted by a driver'
    );
  }

  // 4. Create the review
  const result = await Review.create({
    parcel_id: new Types.ObjectId(payload.parcel_id),
    customer_id: new Types.ObjectId(customerId),
    driver_id: parcel.accepted_by,
    rating: payload.rating,
    feedback: payload.feedback,
  });

  return result;
};

const getDriverReviews = async (driverId: string) => {
  const result = await Review.find({ driver_id: driverId }).populate(
    'customer_id',
    'name profile_image'
  );
  return result;
};

export const ReviewService = {
  createReview,
  getDriverReviews,
};
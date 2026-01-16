import { Types } from 'mongoose';

export type TReview = {
  parcel_id: Types.ObjectId;
  customer_id: Types.ObjectId;
  driver_id: Types.ObjectId;
  rating: number; // 1 to 5
  feedback: string;
};
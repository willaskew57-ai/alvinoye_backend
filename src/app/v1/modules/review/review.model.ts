import { Schema, model } from 'mongoose';
import type { TReview } from './review.interface';

const reviewSchema = new Schema<TReview>(
  {
    parcel_id: { 
      type: Schema.Types.ObjectId, 
      ref: 'Parcel', 
      required: true, 
      unique: true 
    },
    customer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  },
);

export const Review = model<TReview>('Review', reviewSchema);
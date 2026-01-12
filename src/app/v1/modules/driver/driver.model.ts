import { Schema, model } from 'mongoose';
import type { TDriver } from './driver.interface';

const DriverInfoSchema = new Schema<TDriver>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    from: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    to: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    driver_license_number: { type: String, required: true, unique: true },
    license_image: { type: String, required: true },
    stops: { type: String },
    daily_commute_time: { type: String, required: true },
    available_for_delivery: { type: String, required: true },
    max_parcel_weight: { type: String, required: true },
    pickup_time: { type: String, required: true },
    notes: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual for vehicle mapping
DriverInfoSchema.virtual('vehicle', {
  ref: 'Vehicle',
  localField: 'user_id',
  foreignField: 'user_id',
  justOne: true,
});

export const Driver = model<TDriver>('DriverInfo', DriverInfoSchema);

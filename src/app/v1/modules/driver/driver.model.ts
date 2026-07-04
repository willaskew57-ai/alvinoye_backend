import { Schema, model } from 'mongoose';
import type { TDriver } from './driver.interface';

const LocationSchema = new Schema(
  {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const BankDetailsSchema = new Schema(
  {
    bank_name: { type: String },
    account_number: { type: String },
    account_holder_name: { type: String },
  },
  { _id: false }
);

const DriverInfoSchema = new Schema<TDriver>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    from: LocationSchema,
    to: LocationSchema,
    driver_license_number: { type: String, required: true, unique: true },
    license_image: { type: String },
    daily_commute_time: { type: String, required: true },
    max_parcel_weight: { type: String, required: true },
    notes: { type: String },
    bank_details: { type: BankDetailsSchema, default: null },
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

// Drop stale 'user_data_1' index if it exists (legacy index cleanup)
Driver.collection.dropIndex('user_data_1').catch((err) => {
  if (err?.codeName !== 'IndexNotFound') {
    console.warn('Could not drop stale index user_data_1:', err?.message);
  }
});

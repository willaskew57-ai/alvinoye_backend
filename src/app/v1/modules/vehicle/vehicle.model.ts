import { Schema, model } from 'mongoose';
import type { TVehicle } from './vehicle.interface';

const VehicleSchema = new Schema<TVehicle>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'DRIVER',
      required: [true, 'Driver ID (user_id) is required'],
    },
    vehicle_type: { type: String, required: true },
    vehicle_number: { type: String, required: true, unique: true },
    number_plate_image: { type: String, required: true },
    vehicle_images: { type: [String], required: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: false,
    },
  }
);

export const Vehicle = model<TVehicle>('Vehicle', VehicleSchema);

import { Schema, model } from 'mongoose';
import type { TParcel, TParcelPriceRequest } from './parcel.interface';

// --- Parcel Schema ---
const parcelSchema = new Schema<TParcel>(
  {
    parcel_id: { type: String, required: true, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parcel_name: { type: String, required: true },
    size: { type: String, required: true },
    vehicle_type: { type: String, required: true },
    weight: { type: Number, required: true },
    handover_location: { type: String, required: true },
    priority: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    parcel_images: { type: [String], default: [] },
    receiver_name: { type: String, required: true },
    receiver_phone: { type: String, required: true },
    sender_remarks: { type: String },
    status: {
      type: String,
      enum: ['Waiting', 'Pending', 'Ongoing', 'Completed', 'Rejected'],
      default: 'Waiting',
    },
    final_price: { type: Number, default: null },
    price_status: {
      type: String,
      enum: ['NotSet', 'Proposed', 'Countered', 'Accepted', 'Rejected'],
      default: 'NotSet',
    },
    accepted_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    accepted_at: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Parcel = model<TParcel>('Parcel', parcelSchema);

// --- Price Request Schema ---
const priceRequestSchema = new Schema<TParcelPriceRequest>(
  {
    parcel_id: { type: Schema.Types.ObjectId, ref: 'Parcel', required: true },
    proposed_by: { type: String, enum: ['Admin', 'Customer'], required: true },
    proposed_price: { type: Number, required: true },
    message: { type: String },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    decided_at: { type: Date },
  },
  { timestamps: true }
);

export const ParcelPriceRequest = model<TParcelPriceRequest>('ParcelPriceRequest', priceRequestSchema);
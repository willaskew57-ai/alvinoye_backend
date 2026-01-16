import { Schema, model } from 'mongoose';
import {
  PARCEL_STATUS,
  PRICE_REQUEST_STATUS,
  PRICE_STATUS,
  PROPOSED_BY,
  type TParcel,
  type TParcelPriceRequest,
} from './parcel.interface';

// --- Parcel Schema ---
const parcelSchema = new Schema<TParcel>(
  {
    parcel_id: {
      type: String,
      required: true,
      unique: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
      enum: Object.values(PARCEL_STATUS),
      default: PARCEL_STATUS.WAITING,
    },
    final_price: { type: Number, default: null },
    price_status: {
      type: String,
      enum: Object.values(PRICE_STATUS),
      default: PRICE_STATUS.NOT_SET,
    },
    accepted_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    accepted_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual Populate: Links all price history to this Parcel
 */
parcelSchema.virtual('price_requests', {
  ref: 'ParcelPriceRequest',
  localField: '_id',
  foreignField: 'parcel_id',
});

export const Parcel = model<TParcel>('Parcel', parcelSchema);

// --- Price Request Schema ---
const priceRequestSchema = new Schema<TParcelPriceRequest>(
  {
    parcel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Parcel',
      required: true,
    },
    proposed_by: {
      type: String,
      enum: Object.values(PROPOSED_BY),
      required: true,
    },
    proposed_price: { type: Number, required: true },
    rejection_reason: { type: String, default: null },
    message: { type: String },
    is_final_offer: {
      type: Boolean,
      default: false, // Set to true when Admin rejects counter and gives last price
    },
    status: {
      type: String,
      enum: Object.values(PRICE_REQUEST_STATUS),
      default: PRICE_REQUEST_STATUS.PENDING,
    },
    decided_at: { type: Date },
  },
  { timestamps: true }
);

export const ParcelPriceRequest = model<TParcelPriceRequest>(
  'ParcelPriceRequest',
  priceRequestSchema
);
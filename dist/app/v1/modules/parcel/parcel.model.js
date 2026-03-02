import { Schema, model } from 'mongoose';
import { PARCEL_STATUS, PRICE_REQUEST_STATUS, PRICE_STATUS, PRICE_TYPE, PROPOSED_BY, } from './parcel.interface';
const LocationSchema = new Schema({
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { _id: false });
// --- Parcel Schema ---
const parcelSchema = new Schema({
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
    pickup_location: LocationSchema,
    handover_location: LocationSchema,
    priority: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    parcel_images: { type: [String], default: [] },
    receiver_name: { type: String, required: true },
    receiver_phone: { type: String, required: true },
    sender_remarks: { type: String, required: true },
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
    rejection_reason: { type: String, default: null },
    accepted_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    accepted_at: { type: Date, default: null },
    completed_at: { type: Date, default: null },
    stripe_checkout_session_id: { type: String, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
parcelSchema.virtual('price_requests', {
    ref: 'ParcelPriceRequest',
    localField: '_id',
    foreignField: 'parcel_id',
});
parcelSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'parcel_id',
    justOne: true,
});
export const Parcel = model('Parcel', parcelSchema);
// --- Price Request Schema ---
const priceRequestSchema = new Schema({
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
    price_type: {
        type: String,
        enum: Object.values(PRICE_TYPE),
        required: true,
    },
    proposed_price: { type: Number, required: true },
    rejection_reason: { type: String, default: null },
    message: { type: String },
    is_final_offer: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(PRICE_REQUEST_STATUS),
        default: PRICE_REQUEST_STATUS.PENDING,
    },
    decided_at: { type: Date },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
export const ParcelPriceRequest = model('ParcelPriceRequest', priceRequestSchema);
//# sourceMappingURL=parcel.model.js.map
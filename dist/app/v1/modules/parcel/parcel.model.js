import { Schema, model } from 'mongoose';
import { PARCEL_STATUS, PRICE_REQUEST_STATUS, PRICE_STATUS, PROPOSED_BY, } from './parcel.interface';
import { PAYMENT_STATUS } from '../payment/payment.constants';
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
    handover_location: LocationSchema,
    priority: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    parcel_images: { type: [String], default: [] },
    receiver_name: { type: String, required: true },
    receiver_phone: { type: String, required: true },
    sender_remarks: LocationSchema,
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
    stripe_checkout_session_id: { type: String, default: null },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
/**
 * Virtual Populate: Links all price history to this Parcel
 */
parcelSchema.virtual('price_requests', {
    ref: 'ParcelPriceRequest',
    localField: '_id',
    foreignField: 'parcel_id',
});
// Define a virtual field 'review'
parcelSchema.virtual('review', {
    ref: 'Review', // The model to link to
    localField: '_id', // The ID in the Parcel model
    foreignField: 'parcel_id', // The field in the Review model that references Parcel
    justOne: true, // Since one parcel only has one review
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
export const ParcelPriceRequest = model('ParcelPriceRequest', priceRequestSchema);
//# sourceMappingURL=parcel.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelPriceRequest = exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const parcel_interface_1 = require("./parcel.interface");
// const LocationSchema = new Schema(
//   {
//     address: { type: String, required: true },
//     latitude: { type: Number, required: true },
//     longitude: { type: Number, required: true },
//   },
//   { _id: false }
// );
const LocationSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    // Add this field for GeoSpatial queries
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
    },
    coordinates: {
        type: [Number], // This will store [longitude, latitude]
        required: true,
    },
}, { _id: false });
// --- Parcel Schema ---
const parcelSchema = new mongoose_1.Schema({
    parcel_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: Object.values(parcel_interface_1.PARCEL_STATUS),
        default: parcel_interface_1.PARCEL_STATUS.WAITING,
    },
    final_price: { type: Number, default: null },
    price_status: {
        type: String,
        enum: Object.values(parcel_interface_1.PRICE_STATUS),
        default: parcel_interface_1.PRICE_STATUS.NOT_SET,
    },
    rejection_reason: { type: String, default: null },
    accepted_by: {
        type: mongoose_1.Schema.Types.ObjectId,
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
// Add this line after your parcelSchema definition
parcelSchema.index({ 'pickup_location.coordinates': '2dsphere' });
exports.Parcel = (0, mongoose_1.model)('Parcel', parcelSchema);
// --- Price Request Schema ---
const priceRequestSchema = new mongoose_1.Schema({
    parcel_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        required: true,
    },
    proposed_by: {
        type: String,
        enum: Object.values(parcel_interface_1.PROPOSED_BY),
        required: true,
    },
    price_type: {
        type: String,
        enum: Object.values(parcel_interface_1.PRICE_TYPE),
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
        enum: Object.values(parcel_interface_1.PRICE_REQUEST_STATUS),
        default: parcel_interface_1.PRICE_REQUEST_STATUS.PENDING,
    },
    decided_at: { type: Date },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
exports.ParcelPriceRequest = (0, mongoose_1.model)('ParcelPriceRequest', priceRequestSchema);
//# sourceMappingURL=parcel.model.js.map
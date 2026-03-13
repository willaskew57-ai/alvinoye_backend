"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverLocation = void 0;
const mongoose_1 = require("mongoose");
const DriverLocationSchema = new mongoose_1.Schema({
    driver_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Driver ID is required'],
        index: true,
    },
    parcel_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        index: true,
    },
    latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: -90,
        max: 90,
    },
    longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: -180,
        max: 180,
    },
    heading: {
        type: Number,
        min: 0,
        max: 360,
    },
    speed: {
        type: Number,
        min: 0,
    },
    accuracy: {
        type: Number,
        min: 0,
    },
    is_online: {
        type: Boolean,
        default: true,
        index: true,
    },
    last_updated: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
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
});
// Create 2dsphere index for geospatial queries
DriverLocationSchema.index({ latitude: 1, longitude: 1 });
DriverLocationSchema.index({ driver_id: 1, last_updated: -1 });
DriverLocationSchema.index({ parcel_id: 1, last_updated: -1 });
// TTL index - automatically delete documents older than 7 days
DriverLocationSchema.index({ created_at: 1 }, { expireAfterSeconds: 604800 });
exports.DriverLocation = (0, mongoose_1.model)('DriverLocation', DriverLocationSchema);
//# sourceMappingURL=track-driver.model.js.map
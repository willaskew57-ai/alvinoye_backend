"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const LocationSchema = new mongoose_1.Schema({
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
}, { _id: false });
const DriverInfoSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
// Virtual for vehicle mapping
DriverInfoSchema.virtual('vehicle', {
    ref: 'Vehicle',
    localField: 'user_id',
    foreignField: 'user_id',
    justOne: true,
});
exports.Driver = (0, mongoose_1.model)('DriverInfo', DriverInfoSchema);
// Drop stale 'user_data_1' index if it exists (legacy index cleanup)
exports.Driver.collection.dropIndex('user_data_1').catch((err) => {
    if (err?.codeName !== 'IndexNotFound') {
        console.warn('Could not drop stale index user_data_1:', err?.message);
    }
});
//# sourceMappingURL=driver.model.js.map
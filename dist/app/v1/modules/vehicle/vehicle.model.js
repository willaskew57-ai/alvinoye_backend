"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const mongoose_1 = require("mongoose");
const VehicleSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'DRIVER',
        required: [true, 'Driver ID (user_id) is required'],
    },
    vehicle_type: { type: String, required: true },
    vehicle_number: { type: String, required: true, unique: true },
    number_plate_image: { type: String },
    vehicle_images: { type: [String] },
    is_deleted: { type: Boolean, default: false },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    toJSON: {
        virtuals: false,
    },
});
exports.Vehicle = (0, mongoose_1.model)('Vehicle', VehicleSchema);
//# sourceMappingURL=vehicle.model.js.map
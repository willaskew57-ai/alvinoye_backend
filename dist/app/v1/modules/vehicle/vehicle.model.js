import { is } from 'zod/locales';
import { Schema, model } from 'mongoose';
const VehicleSchema = new Schema({
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
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    toJSON: {
        virtuals: false,
    },
});
export const Vehicle = model('Vehicle', VehicleSchema);
//# sourceMappingURL=vehicle.model.js.map
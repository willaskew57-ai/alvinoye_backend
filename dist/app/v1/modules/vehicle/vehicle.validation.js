"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleValidation = void 0;
const v3_1 = require("zod/v3");
const createVehicleValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        user_id: v3_1.z.string().optional(),
        vehicle_type: v3_1.z.string({ required_error: 'Vehicle type is required' }),
        vehicle_number: v3_1.z.string({ required_error: 'Vehicle number is required' }),
        number_plate_image: v3_1.z.string().optional(),
        vehicle_images: v3_1.z.array(v3_1.z.string()).optional(),
    }),
});
exports.VehicleValidation = {
    createVehicleValidationSchema,
};
//# sourceMappingURL=vehicle.validation.js.map
import { z } from 'zod/v3';
const createVehicleValidationSchema = z.object({
    body: z.object({
        user_id: z.string({ required_error: 'Driver ID is required' }).optional(),
        vehicle_type: z.string({ required_error: 'Vehicle type is required' }),
        vehicle_number: z.string({ required_error: 'Vehicle number is required' }),
        number_plate_image: z.string({
            required_error: 'Number plate image is required',
        }),
        vehicle_images: z
            .array(z.string())
            .nonempty('At least one vehicle image is required'),
    }),
});
export const VehicleValidation = {
    createVehicleValidationSchema,
};
//# sourceMappingURL=vehicle.validation.js.map
import { z } from 'zod/v3';

const createVehicleValidationSchema = z.object({
  body: z.object({
    user_id: z.string().optional(),
    vehicle_type: z.string({ required_error: 'Vehicle type is required' }),
    vehicle_number: z.string({ required_error: 'Vehicle number is required' }),
    number_plate_image: z.string().optional(),
    vehicle_images: z.array(z.string()).optional(),
  }),
});

export const VehicleValidation = {
  createVehicleValidationSchema,
};

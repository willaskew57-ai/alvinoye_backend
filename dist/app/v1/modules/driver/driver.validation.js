import { z } from 'zod/v3';
import { VehicleValidation } from '../vehicle/vehicle.validation';
const driverInfoValidationSchema = z.object({
    user_id: z.string({ required_error: 'User ID is required' }).optional(),
    from: z.object({
        address: z.string({ required_error: 'Starting address is required' }),
        latitude: z.number({ required_error: 'Starting latitude is required' }),
        longitude: z.number({ required_error: 'Starting longitude is required' }),
    }),
    to: z.object({
        address: z.string({ required_error: 'Destination address is required' }),
        latitude: z.number({ required_error: 'Destination latitude is required' }),
        longitude: z.number({
            required_error: 'Destination longitude is required',
        }),
    }),
    driver_license_number: z.string({
        required_error: 'license number is required',
    }),
    license_image: z.string({
        required_error: 'license image URL is required',
    }),
    stops: z.string().optional(),
    daily_commute_time: z.string(),
    available_for_delivery: z.string(), // Keeping as string per your table
    max_parcel_weight: z.string(),
    pickup_time: z.string(),
    notes: z.string().optional(),
});
const createDriverWithVehicleValidationSchema = z.object({
    body: z.object({
        driverInfo: driverInfoValidationSchema,
        // Reuse the existing vehicle body validation logic
        vehicle: VehicleValidation.createVehicleValidationSchema.shape.body.omit({
            user_id: true,
        }),
    }),
});
const updateDriverValidationSchema = z.object({
    body: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        driver_license_number: z.string().optional(),
        license_image: z.string().optional(),
        stops: z.string().optional(),
        daily_commute_time: z.string().optional(),
        available_for_delivery: z.string().optional(),
        max_parcel_weight: z.string().optional(),
        pickup_time: z.string().optional(),
        notes: z.string().optional(),
    }),
});
export const DriverValidation = {
    driverInfoValidationSchema,
    updateDriverValidationSchema,
    createDriverWithVehicleValidationSchema,
};
//# sourceMappingURL=driver.validation.js.map
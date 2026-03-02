import { z } from 'zod/v3';
import { VehicleValidation } from '../vehicle/vehicle.validation';
const locationSchema = z.object({
    address: z.string({ required_error: 'Address is required' }),
    latitude: z.string({ required_error: 'Latitude is required' }),
    longitude: z.string({ required_error: 'Longitude is required' }),
});
const driverInfoValidationSchema = z.object({
    user_id: z.string({ required_error: 'User ID is required' }).optional(),
    from: locationSchema,
    to: locationSchema,
    driver_license_number: z.string({
        required_error: 'License number is required',
    }),
    license_image: z.string().optional(),
    daily_commute_time: z.string({ required_error: 'Commute time is required' }),
    max_parcel_weight: z.string({ required_error: 'Max weight is required' }),
    notes: z.string().optional(),
});
const createDriverWithVehicleValidationSchema = z.object({
    body: z.object({
        driverInfo: driverInfoValidationSchema,
        vehicle: VehicleValidation.createVehicleValidationSchema.shape.body.omit({
            user_id: true,
        }),
    }),
});
const updateDriverWithVehicleValidationSchema = z.object({
    body: z.object({
        driverInfo: z
            .object({
            from: locationSchema.optional(),
            to: locationSchema.optional(),
            stops: z.array(locationSchema).optional(),
            driver_license_number: z.string().optional(),
            license_image: z.string().optional(),
            daily_commute_time: z.string().optional(),
            max_parcel_weight: z.string().optional(),
            pickup_time: z.string().optional(),
            notes: z.string().optional(),
        })
            .optional(),
        vehicle: z
            .object({
            vehicle_type: z.string().optional(),
            vehicle_number: z.string().optional(),
            number_plate_image: z.string().optional(),
            vehicle_images: z.array(z.string()).optional(),
            existing_vehicle_images: z.array(z.string()).optional(),
        })
            .optional(),
    }),
});
const verifyParcelOtpValidationSchema = z.object({
    body: z.object({
        parcel_id: z.string({ required_error: 'Parcel ID is required' }),
        otp: z
            .string({ required_error: 'OTP is required' })
            .length(6, 'OTP must be exactly 6 digits'),
    }),
});
export const DriverValidation = {
    createDriverWithVehicleValidationSchema,
    updateDriverWithVehicleValidationSchema,
    verifyParcelOtpValidationSchema,
};
//# sourceMappingURL=driver.validation.js.map
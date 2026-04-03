"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverValidation = void 0;
const v3_1 = require("zod/v3");
const vehicle_validation_1 = require("../vehicle/vehicle.validation");
const locationSchema = v3_1.z.object({
    address: v3_1.z.string({ required_error: 'Address is required' }),
    latitude: v3_1.z.string({ required_error: 'Latitude is required' }),
    longitude: v3_1.z.string({ required_error: 'Longitude is required' }),
});
const driverInfoValidationSchema = v3_1.z.object({
    user_id: v3_1.z.string({ required_error: 'User ID is required' }).optional(),
    from: locationSchema,
    to: locationSchema,
    driver_license_number: v3_1.z.string({
        required_error: 'License number is required',
    }),
    license_image: v3_1.z.string().optional(),
    daily_commute_time: v3_1.z.string({ required_error: 'Commute time is required' }),
    max_parcel_weight: v3_1.z.string({ required_error: 'Max weight is required' }),
    notes: v3_1.z.string().optional(),
});
const createDriverWithVehicleValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        driverInfo: driverInfoValidationSchema,
        vehicle: vehicle_validation_1.VehicleValidation.createVehicleValidationSchema.shape.body.omit({
            user_id: true,
        }),
    }),
});
const updateDriverWithVehicleValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        driverInfo: v3_1.z
            .object({
            from: locationSchema.optional(),
            to: locationSchema.optional(),
            stops: v3_1.z.array(locationSchema).optional(),
            driver_license_number: v3_1.z.string().optional(),
            license_image: v3_1.z.string().optional(),
            daily_commute_time: v3_1.z.string().optional(),
            max_parcel_weight: v3_1.z.string().optional(),
            pickup_time: v3_1.z.string().optional(),
            notes: v3_1.z.string().optional(),
        })
            .optional(),
        vehicle: v3_1.z
            .object({
            vehicle_type: v3_1.z.string().optional(),
            vehicle_number: v3_1.z.string().optional(),
            number_plate_image: v3_1.z.string().optional(),
            vehicle_images: v3_1.z.array(v3_1.z.string()).optional(),
            existing_vehicle_images: v3_1.z.array(v3_1.z.string()).optional(),
        })
            .optional(),
    }),
});
const verifyParcelOtpValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID is required' }),
        otp: v3_1.z
            .string({ required_error: 'OTP is required' })
            .length(6, 'OTP must be exactly 6 digits'),
    }),
});
const getAvailableParcelsValidationSchema = v3_1.z.object({
    query: v3_1.z.object({
        currentLat: v3_1.z
            .string({ required_error: 'currentLat is required' })
            .refine((val) => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
            message: 'currentLat must be a valid latitude (-90 to 90)',
        }),
        currentLng: v3_1.z
            .string({ required_error: 'currentLng is required' })
            .refine((val) => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
            message: 'currentLng must be a valid longitude (-180 to 180)',
        }),
        heading: v3_1.z
            .string()
            .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) < 360), { message: 'heading must be a number between 0-360' })
            .optional(),
        radiusMeters: v3_1.z
            .string()
            .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
            message: 'radiusMeters must be a positive number',
        })
            .optional(),
        page: v3_1.z
            .string()
            .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
            message: 'page must be a positive number',
        })
            .optional(),
        limit: v3_1.z
            .string()
            .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
            message: 'limit must be a positive number',
        })
            .optional(),
    }),
});
const selectParcelValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID is required' }),
        routeContext: v3_1.z.object({
            fromLat: v3_1.z.number(),
            fromLng: v3_1.z.number(),
            toLat: v3_1.z.number().optional(),
            toLng: v3_1.z.number().optional(),
            routePolyline: v3_1.z.string().optional(),
        }).optional(),
    }),
});
exports.DriverValidation = {
    createDriverWithVehicleValidationSchema,
    updateDriverWithVehicleValidationSchema,
    verifyParcelOtpValidationSchema,
    getAvailableParcelsValidationSchema,
    selectParcelValidationSchema,
};
//# sourceMappingURL=driver.validation.js.map
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
exports.DriverValidation = {
    createDriverWithVehicleValidationSchema,
    updateDriverWithVehicleValidationSchema,
    verifyParcelOtpValidationSchema,
};
//# sourceMappingURL=driver.validation.js.map
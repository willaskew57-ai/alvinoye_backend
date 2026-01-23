import { z } from 'zod/v3';
import { VehicleValidation } from '../vehicle/vehicle.validation';

const locationSchema = z.object({
  address: z.string({ required_error: 'Address is required' }),
  latitude: z.number({ required_error: 'Latitude is required' }),
  longitude: z.number({ required_error: 'Longitude is required' }),
});

const driverInfoValidationSchema = z.object({
  user_id: z.string({ required_error: 'User ID is required' }).optional(),
  from: locationSchema,
  to: locationSchema,
  stops: z.array(locationSchema).optional(),
  driver_license_number: z.string({
    required_error: 'License number is required',
  }),
  license_image: z.string({
    required_error: 'License image URL is required',
  }),
  daily_commute_time: z.string({ required_error: 'Commute time is required' }),
  // available_for_delivery: z.string({
  //   required_error: 'Availability is required',
  // }),
  max_parcel_weight: z.string({ required_error: 'Max weight is required' }),
  pickup_time: z.string({ required_error: 'Pickup time is required' }),
  notes: z.string().optional(),
});

// Combined Validation for Creation
const createDriverWithVehicleValidationSchema = z.object({
  body: z.object({
    driverInfo: driverInfoValidationSchema,
    vehicle: VehicleValidation.createVehicleValidationSchema.shape.body.omit({
      user_id: true,
    }),
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
  driverInfoValidationSchema,
  createDriverWithVehicleValidationSchema,
  verifyParcelOtpValidationSchema,
};

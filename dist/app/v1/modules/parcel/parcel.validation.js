import { z } from 'zod/v3';
const locationValidationSchema = z.object({
    address: z.string({ required_error: 'Address is required' }),
    latitude: z.number({ required_error: 'Latitude is required' }),
    longitude: z.number({ required_error: 'Longitude is required' }),
});
import { PARCEL_STATUS, PRICE_REQUEST_STATUS, PRICE_STATUS, } from './parcel.interface';
// --- Reusable Enum Validations based on your Interface ---
const ParcelStatusEnum = z.nativeEnum(PARCEL_STATUS);
const PriceStatusEnum = z.nativeEnum(PRICE_STATUS);
export const createParcelValidationSchema = z.object({
    body: z.object({
        parcel_name: z
            .string({ required_error: 'Parcel name is required' })
            .min(3)
            .max(100),
        size: z.string({ required_error: 'Size is required' }),
        vehicle_type: z.string({ required_error: 'Vehicle type is required' }),
        weight: z.number({ required_error: 'Weight is required' }).positive(),
        handover_location: locationValidationSchema,
        priority: z.string({ required_error: 'Priority is required' }),
        date: z.string({ required_error: 'Date is required' }),
        time: z.string({ required_error: 'Time is required' }),
        parcel_images: z.array(z.string().url()).optional().default([]),
        receiver_name: z.string({ required_error: 'Receiver name is required' }),
        receiver_phone: z.string({ required_error: 'Receiver phone is required' }),
        sender_remarks: locationValidationSchema,
    }),
});
export const updateParcelValidationSchema = z.object({
    body: z.object({
        parcel_name: z.string().optional(),
        size: z.string().optional(),
        vehicle_type: z.string().optional(),
        weight: z.number().positive().optional(),
        // Updated to optional object validation
        // .partial() allows updating just the address or just the lat/long if preferred
        handover_location: locationValidationSchema.partial().optional(),
        priority: z.string().optional(),
        date: z.string().optional(),
        time: z.string().optional(),
        parcel_images: z.array(z.string().url()).optional(),
        receiver_name: z.string().optional(),
        receiver_phone: z.string().optional(),
        // Updated to optional object validation
        sender_remarks: locationValidationSchema.partial().optional(),
    }),
});
const createPriceRequestValidationSchema = z.object({
    body: z.object({
        parcel_id: z.string({ required_error: 'Parcel ID (ObjectId) is required' }),
        proposed_price: z
            .number({ required_error: 'Proposed price is required' })
            .positive(),
        message: z.string().max(500).optional(),
    }),
});
const customerRejectAndCounterValidationSchema = z.object({
    body: z.object({
        parcel_id: z.string({ required_error: 'Parcel ID is required' }),
        rejection_reason: z.string({
            required_error: 'Rejection reason is required',
        }),
        suggested_price: z
            .number({ required_error: 'Suggested price is required' })
            .positive(),
    }),
});
const adminRejectAndFinalOfferValidationSchema = z.object({
    body: z.object({
        parcel_id: z.string({ required_error: 'Parcel ID is required' }),
        final_price: z
            .number({ required_error: 'Final price is required' })
            .positive(),
        message: z.string().optional(),
    }),
});
const acceptPriceRequestValidationSchema = z.object({
    body: z.object({
        status: z.enum([PRICE_REQUEST_STATUS.ACCEPTED], {
            required_error: 'Status must be either ACCEPTED',
        }),
    }),
});
const adminUpdateParcelValidationSchema = z.object({
    body: z.object({
        status: ParcelStatusEnum.optional(),
        final_price: z.number().positive().optional(),
        price_status: PriceStatusEnum.optional(),
    }),
});
export const ParcelValidations = {
    createParcelValidationSchema,
    updateParcelValidationSchema,
    createPriceRequestValidationSchema,
    customerRejectAndCounterValidationSchema,
    adminRejectAndFinalOfferValidationSchema,
    acceptPriceRequestValidationSchema,
    adminUpdateParcelValidationSchema,
};
//# sourceMappingURL=parcel.validation.js.map
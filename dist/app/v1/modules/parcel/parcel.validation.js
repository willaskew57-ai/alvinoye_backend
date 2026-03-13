"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelValidations = exports.updateParcelValidationSchema = exports.createParcelValidationSchema = void 0;
const v3_1 = require("zod/v3");
const locationValidationSchema = v3_1.z.object({
    address: v3_1.z.string({ required_error: 'Address is required' }),
    latitude: v3_1.z.number({ required_error: 'Latitude is required' }),
    longitude: v3_1.z.number({ required_error: 'Longitude is required' }),
});
const parcel_interface_1 = require("./parcel.interface");
// --- Reusable Enum Validations based on your Interface ---
const ParcelStatusEnum = v3_1.z.nativeEnum(parcel_interface_1.PARCEL_STATUS);
const PriceStatusEnum = v3_1.z.nativeEnum(parcel_interface_1.PRICE_STATUS);
exports.createParcelValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_name: v3_1.z
            .string({ required_error: 'Parcel name is required' })
            .min(3)
            .max(100),
        size: v3_1.z.string({ required_error: 'Size is required' }),
        vehicle_type: v3_1.z.string({ required_error: 'Vehicle type is required' }),
        weight: v3_1.z.number({ required_error: 'Weight is required' }).positive(),
        handover_location: locationValidationSchema,
        pickup_location: locationValidationSchema,
        priority: v3_1.z.string({ required_error: 'Priority is required' }),
        date: v3_1.z.string({ required_error: 'Date is required' }),
        time: v3_1.z.string({ required_error: 'Time is required' }),
        parcel_images: v3_1.z.array(v3_1.z.string().url()).optional(),
        receiver_name: v3_1.z.string({ required_error: 'Receiver name is required' }),
        receiver_phone: v3_1.z.string({ required_error: 'Receiver phone is required' }),
        sender_remarks: v3_1.z.string({ required_error: 'Sender remarks is required' }),
    }),
});
exports.updateParcelValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_name: v3_1.z.string().optional(),
        size: v3_1.z.string().optional(),
        vehicle_type: v3_1.z.string().optional(),
        weight: v3_1.z.number().positive().optional(),
        handover_location: locationValidationSchema.partial().optional(),
        pickup_location: locationValidationSchema.partial().optional(),
        priority: v3_1.z.string().optional(),
        date: v3_1.z.string().optional(),
        time: v3_1.z.string().optional(),
        parcel_images: v3_1.z.array(v3_1.z.string().url()).optional(),
        receiver_name: v3_1.z.string().optional(),
        receiver_phone: v3_1.z.string().optional(),
        sender_remarks: v3_1.z.string().optional(),
        existing_parcel_images: v3_1.z.array(v3_1.z.string()).optional(),
    }),
});
const rejectParcelValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        rejection_reason: v3_1.z
            .string({
            required_error: 'Rejection reason is required',
            invalid_type_error: 'Rejection reason must be a string',
        })
            .trim()
            .min(1, 'Rejection reason cannot be empty'),
    }),
});
const createPriceRequestValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID (ObjectId) is required' }),
        proposed_price: v3_1.z
            .number({ required_error: 'Proposed price is required' })
            .positive(),
        message: v3_1.z.string().max(500).optional(),
    }),
});
const customerRejectAndCounterValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID is required' }),
        rejection_reason: v3_1.z.string({
            required_error: 'Rejection reason is required',
        }),
        suggested_price: v3_1.z
            .number({ required_error: 'Suggested price is required' })
            .positive(),
    }),
});
const adminRejectAndFinalOfferValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID is required' }),
        final_price: v3_1.z
            .number({ required_error: 'Final price is required' })
            .positive(),
        message: v3_1.z.string().optional(),
    }),
});
const adminUpdateParcelValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        status: ParcelStatusEnum.optional(),
        final_price: v3_1.z.number().positive().optional(),
        price_status: PriceStatusEnum.optional(),
    }),
});
exports.ParcelValidations = {
    createParcelValidationSchema: exports.createParcelValidationSchema,
    updateParcelValidationSchema: exports.updateParcelValidationSchema,
    rejectParcelValidationSchema,
    createPriceRequestValidationSchema,
    customerRejectAndCounterValidationSchema,
    adminRejectAndFinalOfferValidationSchema,
    adminUpdateParcelValidationSchema,
};
//# sourceMappingURL=parcel.validation.js.map
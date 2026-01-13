import { z } from 'zod/v3';

// --- Reusable Enums ---
const ParcelStatus = z.enum(['Waiting', 'Pending', 'Ongoing', 'Completed', 'Rejected']);
const PriceStatus = z.enum(['NotSet', 'Proposed', 'Countered', 'Accepted', 'Rejected']);
const ProposedBy = z.enum(['Admin', 'Customer']);
const PriceRequestStatus = z.enum(['Pending', 'Accepted', 'Rejected']);

// --- Schemas ---

const createParcelValidationSchema = z.object({
  body: z.object({
    parcel_name: z.string({ required_error: 'Parcel name is required' }).min(3).max(100),
    size: z.string({ required_error: 'Size is required' }),
    vehicle_type: z.string({ required_error: 'Vehicle type is required' }),
    weight: z.number({ required_error: 'Weight is required' }).positive(),
    handover_location: z.string({ required_error: 'Handover location is required' }),
    priority: z.string({ required_error: 'Priority is required' }),
    date: z.string({ required_error: 'Date is required' }), // Validates as string, format 'YYYY-MM-DD'
    time: z.string({ required_error: 'Time is required' }),
    parcel_images: z.array(z.string().url()).optional().default([]),
    receiver_name: z.string({ required_error: 'Receiver name is required' }),
    receiver_phone: z.string({ required_error: 'Receiver phone is required' }),
    sender_remarks: z.string().optional(),
  }),
});

const updateParcelValidationSchema = z.object({
  body: z.object({
    parcel_name: z.string().optional(),
    size: z.string().optional(),
    vehicle_type: z.string().optional(),
    weight: z.number().positive().optional(),
    handover_location: z.string().optional(),
    priority: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    parcel_images: z.array(z.string().url()).optional(),
    receiver_name: z.string().optional(),
    receiver_phone: z.string().optional(),
    sender_remarks: z.string().optional(),
    status: ParcelStatus.optional(),
  }),
});

/**
 * Validation for when an Admin or Customer proposes a price
 */
const createPriceRequestValidationSchema = z.object({
  body: z.object({
    parcel_id: z.string({ required_error: 'Parcel ID (ObjectId) is required' }),
    proposed_price: z.number({ required_error: 'Proposed price is required' }).positive(),
    message: z.string().max(500, 'Message cannot exceed 500 characters').optional(),
  }),
});

/**
 * Validation for accepting or rejecting a price proposal
 */
const respondPriceRequestValidationSchema = z.object({
  body: z.object({
    status: z.enum(['Accepted', 'Rejected'], {
      required_error: 'Status must be either Accepted or Rejected',
    }),
  }),
});

/**
 * Validation for Admin to manually override status or final price
 */
const adminUpdateParcelValidationSchema = z.object({
  body: z.object({
    status: ParcelStatus.optional(),
    final_price: z.number().positive().optional(),
    price_status: PriceStatus.optional(),
  }),
});

export const ParcelValidations = {
  createParcelValidationSchema,
  updateParcelValidationSchema,
  createPriceRequestValidationSchema,
  respondPriceRequestValidationSchema,
  adminUpdateParcelValidationSchema,
};
import z from 'zod/v3';
/**
 * Zod Schemas
 */
export const createCheckoutSchema = z.object({
    body: z.object({
        parcel_id: z.string().min(1, 'Parcel ID is required'),
    }),
});
export const refundPaymentSchema = z.object({
    body: z.object({
        payment_id: z.string().min(1, 'Payment ID is required'),
        reason: z.string().optional(),
    }),
});
//# sourceMappingURL=payment.validation.js.map
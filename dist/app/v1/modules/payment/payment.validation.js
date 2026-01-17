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
        paymentId: z.string().min(1, 'Payment ID is required'),
        reason: z
            .enum(['duplicate', 'fraudulent', 'requested_by_customer'])
            .optional(),
    }),
});
//# sourceMappingURL=payment.validation.js.map
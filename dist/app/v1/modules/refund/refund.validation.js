import { z } from 'zod/v3';
export const requestRefundSchema = z.object({
    body: z.object({
        reason: z.string().min(5, 'Refund reason is required'),
    }),
});
export const adminRefundDecisionSchema = z.object({
    body: z.object({
        action: z.enum(['APPROVE', 'REJECT']),
        adminNote: z.string().optional(),
    }),
});
//# sourceMappingURL=refund.validation.js.map
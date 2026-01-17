// refund.validation.ts
import { z } from 'zod/v3';

export const requestRefundSchema = z.object({
  body: z.object({
    paymentId: z.string(),
    reason: z.string().min(5, 'Refund reason is required'),
  }),
});

export const adminRefundDecisionSchema = z.object({
  body: z.object({
    refundRequestId: z.string(),
    action: z.enum(['APPROVE', 'REJECT']),
    adminNote: z.string().optional(),
  }),
});


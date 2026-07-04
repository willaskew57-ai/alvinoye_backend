import { z } from 'zod/v3';

const withdrawSchema = z.object({
  body: z.object({
    amount: z
      .number({ required_error: 'Amount is required' })
      .positive('Amount must be greater than 0'),
  }),
});

const updateCommissionSchema = z.object({
  body: z.object({
    percentage: z
      .number({ required_error: 'Percentage is required' })
      .min(0, 'Percentage cannot be negative')
      .max(100, 'Percentage cannot exceed 100'),
  }),
});

export const WalletValidation = {
  withdrawSchema,
  updateCommissionSchema,
};

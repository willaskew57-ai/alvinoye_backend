"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletValidation = void 0;
const v3_1 = require("zod/v3");
const withdrawSchema = v3_1.z.object({
    body: v3_1.z.object({
        amount: v3_1.z
            .number({ required_error: 'Amount is required' })
            .positive('Amount must be greater than 0'),
    }),
});
const updateCommissionSchema = v3_1.z.object({
    body: v3_1.z.object({
        percentage: v3_1.z
            .number({ required_error: 'Percentage is required' })
            .min(0, 'Percentage cannot be negative')
            .max(100, 'Percentage cannot exceed 100'),
    }),
});
exports.WalletValidation = {
    withdrawSchema,
    updateCommissionSchema,
};
//# sourceMappingURL=wallet.validation.js.map
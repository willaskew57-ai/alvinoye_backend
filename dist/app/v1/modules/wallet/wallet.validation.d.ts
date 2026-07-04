import { z } from 'zod/v3';
export declare const WalletValidation: {
    withdrawSchema: z.ZodObject<{
        body: z.ZodObject<{
            amount: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            amount: number;
        }, {
            amount: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            amount: number;
        };
    }, {
        body: {
            amount: number;
        };
    }>;
    updateCommissionSchema: z.ZodObject<{
        body: z.ZodObject<{
            percentage: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            percentage: number;
        }, {
            percentage: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            percentage: number;
        };
    }, {
        body: {
            percentage: number;
        };
    }>;
};
//# sourceMappingURL=wallet.validation.d.ts.map
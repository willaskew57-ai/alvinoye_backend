import z from 'zod/v3';
/**
 * Zod Schemas
 */
export declare const createCheckoutSchema: z.ZodObject<{
    body: z.ZodObject<{
        parcel_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        parcel_id: string;
    }, {
        parcel_id: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        parcel_id: string;
    };
}, {
    body: {
        parcel_id: string;
    };
}>;
export declare const refundPaymentSchema: z.ZodObject<{
    body: z.ZodObject<{
        payment_id: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        payment_id: string;
        reason?: string | undefined;
    }, {
        payment_id: string;
        reason?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        payment_id: string;
        reason?: string | undefined;
    };
}, {
    body: {
        payment_id: string;
        reason?: string | undefined;
    };
}>;
//# sourceMappingURL=payment.validation.d.ts.map
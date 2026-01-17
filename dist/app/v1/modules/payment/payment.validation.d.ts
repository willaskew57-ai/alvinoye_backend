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
        paymentId: z.ZodString;
        reason: z.ZodOptional<z.ZodEnum<["duplicate", "fraudulent", "requested_by_customer"]>>;
    }, "strip", z.ZodTypeAny, {
        paymentId: string;
        reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
    }, {
        paymentId: string;
        reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        paymentId: string;
        reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
    };
}, {
    body: {
        paymentId: string;
        reason?: "duplicate" | "fraudulent" | "requested_by_customer" | undefined;
    };
}>;
//# sourceMappingURL=payment.validation.d.ts.map
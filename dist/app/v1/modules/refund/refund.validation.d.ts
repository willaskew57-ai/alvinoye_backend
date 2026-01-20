import { z } from 'zod/v3';
export declare const requestRefundSchema: z.ZodObject<{
    body: z.ZodObject<{
        paymentId: z.ZodString;
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
        paymentId: string;
    }, {
        reason: string;
        paymentId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        reason: string;
        paymentId: string;
    };
}, {
    body: {
        reason: string;
        paymentId: string;
    };
}>;
export declare const adminRefundDecisionSchema: z.ZodObject<{
    body: z.ZodObject<{
        refundRequestId: z.ZodString;
        action: z.ZodEnum<["APPROVE", "REJECT"]>;
        adminNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        action: "APPROVE" | "REJECT";
        refundRequestId: string;
        adminNote?: string | undefined;
    }, {
        action: "APPROVE" | "REJECT";
        refundRequestId: string;
        adminNote?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        action: "APPROVE" | "REJECT";
        refundRequestId: string;
        adminNote?: string | undefined;
    };
}, {
    body: {
        action: "APPROVE" | "REJECT";
        refundRequestId: string;
        adminNote?: string | undefined;
    };
}>;
//# sourceMappingURL=refund.validation.d.ts.map
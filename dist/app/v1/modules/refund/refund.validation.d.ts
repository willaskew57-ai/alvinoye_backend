import { z } from 'zod/v3';
export declare const requestRefundSchema: z.ZodObject<{
    body: z.ZodObject<{
        reason: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        reason: string;
    }, {
        reason: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        reason: string;
    };
}, {
    body: {
        reason: string;
    };
}>;
export declare const adminRefundDecisionSchema: z.ZodObject<{
    body: z.ZodObject<{
        action: z.ZodEnum<["APPROVE", "REJECT"]>;
        adminNote: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        action: "APPROVE" | "REJECT";
        adminNote?: string | undefined;
    }, {
        action: "APPROVE" | "REJECT";
        adminNote?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        action: "APPROVE" | "REJECT";
        adminNote?: string | undefined;
    };
}, {
    body: {
        action: "APPROVE" | "REJECT";
        adminNote?: string | undefined;
    };
}>;
//# sourceMappingURL=refund.validation.d.ts.map
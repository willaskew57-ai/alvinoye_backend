import { z } from 'zod/v3';
export declare const createReviewValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        parcel_id: z.ZodString;
        rating: z.ZodNumber;
        feedback: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        parcel_id: string;
        rating: number;
        feedback: string;
    }, {
        parcel_id: string;
        rating: number;
        feedback: string;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        parcel_id: string;
        rating: number;
        feedback: string;
    };
}, {
    body: {
        parcel_id: string;
        rating: number;
        feedback: string;
    };
}>;
//# sourceMappingURL=review.validation.d.ts.map
import { z } from 'zod/v3';
export const createReviewValidationSchema = z.object({
    body: z.object({
        parcel_id: z.string({ required_error: 'Parcel ID is required' }),
        rating: z.number().min(1).max(5),
        feedback: z.string().min(5, 'Feedback must be at least 5 characters long'),
    }),
});
//# sourceMappingURL=review.validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewValidationSchema = void 0;
const v3_1 = require("zod/v3");
exports.createReviewValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        parcel_id: v3_1.z.string({ required_error: 'Parcel ID is required' }),
        rating: v3_1.z.number().min(1).max(5),
        feedback: v3_1.z.string().min(5, 'Feedback must be at least 5 characters long'),
    }),
});
//# sourceMappingURL=review.validation.js.map
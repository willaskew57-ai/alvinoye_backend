import { z } from 'zod/v3';
const verifyOtpValidationSchema = z.object({
    body: z.object({
        user_id: z.string().optional(),
        parcel_id: z.string().optional(),
        otp: z.string().length(6),
        purpose: z.enum(['REGISTER', 'RESET_PASSWORD', 'PARCEL']),
    }),
});
const resendOtpValidationSchema = z.object({
    body: z.object({
        email: z.string().email("Valid email is required"),
        purpose: z.enum(['REGISTER', 'LOGIN', 'RESET_PASSWORD']),
    }),
});
export const OtpValidations = {
    verifyOtpValidationSchema,
    resendOtpValidationSchema,
};
//# sourceMappingURL=otp.validation.js.map
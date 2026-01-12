import { z } from 'zod/v3';
const verifyOtpValidationSchema = z.object({
    body: z.object({
        user_id: z.string({ required_error: "User ID is required" }),
        otp: z
            .string({ required_error: "OTP is required" })
            .length(6, "OTP must be exactly 6 digits"),
        purpose: z.enum(['REGISTER', 'LOGIN', 'RESET_PASSWORD'], {
            required_error: "Purpose is required",
        }),
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
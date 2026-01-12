import { z } from 'zod/v3';
const registerValidationSchema = z.object({
    body: z.object({
        full_name: z.string({ required_error: 'Full name is required' }),
        email: z
            .string({ required_error: 'Email is required' })
            .email('Invalid email address'),
        password: z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters long'),
        role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'DRIVER'], {
            required_error: 'Role is required',
        }),
    }),
});
const loginValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email(),
        password: z.string({ required_error: 'Password is required' }),
    }),
});
const verifyOtpValidationSchema = z.object({
    body: z.object({
        user_id: z.string({ required_error: 'User ID is required' }),
        otp: z
            .string({ required_error: 'OTP is required' })
            .length(6, 'OTP must be 6 digits'),
        purpose: z.enum(['REGISTER', 'RESET_PASSWORD'], {
            required_error: 'Purpose is required',
        }),
    }),
});
const resendOtpValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email(),
        purpose: z.enum(['REGISTER', 'RESET_PASSWORD'], {
            required_error: 'Purpose is required',
        }),
    }),
});
const changePasswordValidationSchema = z.object({
    body: z.object({
        old_password: z.string({ required_error: 'Old password is required' }),
        new_password: z.string({ required_error: 'New password is required' }),
    }),
});
const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refresh_token: z.string({ required_error: 'Refresh token is required' }),
    }),
});
const forgetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.string({ required_error: 'Email is required' }).email(),
    }),
});
const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({ required_error: 'User ID is required' }), // This is the mongo _id
        new_password: z.string({ required_error: 'New password is required' }),
    }),
});
export const AuthValidations = {
    registerValidationSchema,
    loginValidationSchema,
    verifyOtpValidationSchema,
    resendOtpValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
//# sourceMappingURL=auth.validation.js.map
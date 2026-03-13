"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidations = void 0;
const v3_1 = require("zod/v3");
const registerValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        full_name: v3_1.z.string({ required_error: 'Full name is required' }),
        email: v3_1.z
            .string({ required_error: 'Email is required' })
            .email('Invalid email address'),
        password: v3_1.z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters long'),
        role: v3_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'DRIVER'], {
            required_error: 'Role is required',
        }),
    }),
});
const loginValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        email: v3_1.z.string({ required_error: 'Email is required' }).email(),
        password: v3_1.z.string({ required_error: 'Password is required' }),
    }),
});
const verifyOtpValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        otp: v3_1.z
            .string({ required_error: 'OTP is required' })
            .length(6, 'OTP must be 6 digits'),
        purpose: v3_1.z.enum(['REGISTER', 'RESET_PASSWORD'], {
            required_error: 'Purpose is required',
        }),
    }),
});
const resendOtpValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        email: v3_1.z.string({ required_error: 'Email is required' }).email(),
        purpose: v3_1.z.enum(['REGISTER', 'RESET_PASSWORD'], {
            required_error: 'Purpose is required',
        }),
    }),
});
const changePasswordValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        old_password: v3_1.z.string({ required_error: 'Old password is required' }),
        new_password: v3_1.z.string({ required_error: 'New password is required' }),
    }),
});
const refreshTokenValidationSchema = v3_1.z.object({
    cookies: v3_1.z.object({
        refresh_token: v3_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
const forgetPasswordValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        email: v3_1.z.string({ required_error: 'Email is required' }).email(),
    }),
});
const resetPasswordValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        new_password: v3_1.z.string({ required_error: 'New password is required' }),
    }),
});
exports.AuthValidations = {
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
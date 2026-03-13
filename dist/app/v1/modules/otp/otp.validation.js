"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpValidations = void 0;
const v3_1 = require("zod/v3");
const verifyOtpValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        user_id: v3_1.z.string().optional(),
        parcel_id: v3_1.z.string().optional(),
        otp: v3_1.z.string().length(6),
        purpose: v3_1.z.enum(['REGISTER', 'RESET_PASSWORD', 'PARCEL']),
    }),
});
const resendOtpValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        email: v3_1.z.string().email('Valid email is required'),
        purpose: v3_1.z.enum(['REGISTER', 'RESET_PASSWORD']),
    }),
});
exports.OtpValidations = {
    verifyOtpValidationSchema,
    resendOtpValidationSchema,
};
//# sourceMappingURL=otp.validation.js.map
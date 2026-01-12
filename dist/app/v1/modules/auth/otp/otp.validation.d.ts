import { z } from 'zod/v3';
export declare const OtpValidations: {
    verifyOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            user_id: z.ZodString;
            otp: z.ZodString;
            purpose: z.ZodEnum<["REGISTER", "LOGIN", "RESET_PASSWORD"]>;
        }, "strip", z.ZodTypeAny, {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        }, {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        };
    }, {
        body: {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        };
    }>;
    resendOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            purpose: z.ZodEnum<["REGISTER", "LOGIN", "RESET_PASSWORD"]>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        }, {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        };
    }, {
        body: {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "LOGIN";
        };
    }>;
};
//# sourceMappingURL=otp.validation.d.ts.map
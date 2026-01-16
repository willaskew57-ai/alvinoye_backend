import { z } from 'zod/v3';
export declare const OtpValidations: {
    verifyOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            user_id: z.ZodOptional<z.ZodString>;
            parcel_id: z.ZodOptional<z.ZodString>;
            otp: z.ZodString;
            purpose: z.ZodEnum<["REGISTER", "RESET_PASSWORD", "PARCEL"]>;
        }, "strip", z.ZodTypeAny, {
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "PARCEL";
            user_id?: string | undefined;
            parcel_id?: string | undefined;
        }, {
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "PARCEL";
            user_id?: string | undefined;
            parcel_id?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "PARCEL";
            user_id?: string | undefined;
            parcel_id?: string | undefined;
        };
    }, {
        body: {
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD" | "PARCEL";
            user_id?: string | undefined;
            parcel_id?: string | undefined;
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
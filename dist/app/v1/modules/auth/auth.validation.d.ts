import { z } from 'zod/v3';
export declare const AuthValidations: {
    registerValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            role: z.ZodEnum<["SUPER_ADMIN", "ADMIN", "CUSTOMER", "DRIVER"]>;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
        }, {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
        };
    }, {
        body: {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
        };
    }>;
    loginValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
            password: string;
        }, {
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            password: string;
        };
    }, {
        body: {
            email: string;
            password: string;
        };
    }>;
    verifyOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            user_id: z.ZodString;
            otp: z.ZodString;
            purpose: z.ZodEnum<["REGISTER", "RESET_PASSWORD"]>;
        }, "strip", z.ZodTypeAny, {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        }, {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        };
    }, {
        body: {
            user_id: string;
            otp: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        };
    }>;
    resendOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
            purpose: z.ZodEnum<["REGISTER", "RESET_PASSWORD"]>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        }, {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        };
    }, {
        body: {
            email: string;
            purpose: "REGISTER" | "RESET_PASSWORD";
        };
    }>;
    changePasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            old_password: z.ZodString;
            new_password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            old_password: string;
            new_password: string;
        }, {
            old_password: string;
            new_password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            old_password: string;
            new_password: string;
        };
    }, {
        body: {
            old_password: string;
            new_password: string;
        };
    }>;
    refreshTokenValidationSchema: z.ZodObject<{
        cookies: z.ZodObject<{
            refresh_token: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            refresh_token: string;
        }, {
            refresh_token: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        cookies: {
            refresh_token: string;
        };
    }, {
        cookies: {
            refresh_token: string;
        };
    }>;
    forgetPasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            email: string;
        }, {
            email: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            email: string;
        };
    }, {
        body: {
            email: string;
        };
    }>;
    resetPasswordValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            id: z.ZodString;
            new_password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            new_password: string;
        }, {
            id: string;
            new_password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            id: string;
            new_password: string;
        };
    }, {
        body: {
            id: string;
            new_password: string;
        };
    }>;
};
//# sourceMappingURL=auth.validation.d.ts.map
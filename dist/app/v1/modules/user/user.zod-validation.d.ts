import { z } from 'zod/v3';
export declare const UserValidation: {
    createUserValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
            email: string;
            password: string;
        }, {
            full_name: string;
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name: string;
            email: string;
            password: string;
        };
    }, {
        body: {
            full_name: string;
            email: string;
            password: string;
        };
    }>;
    createAdminValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
            email: string;
            password: string;
        }, {
            full_name: string;
            email: string;
            password: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name: string;
            email: string;
            password: string;
        };
    }, {
        body: {
            full_name: string;
            email: string;
            password: string;
        };
    }>;
    updateUserValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            profile_picture: z.ZodOptional<z.ZodString>;
            address: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            address?: string | undefined;
            profile_picture?: string | undefined;
        }, {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            address?: string | undefined;
            profile_picture?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            address?: string | undefined;
            profile_picture?: string | undefined;
        };
    }, {
        body: {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            address?: string | undefined;
            profile_picture?: string | undefined;
        };
    }>;
    changeStatusValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodNativeEnum<{
                readonly PENDING: "PENDING";
                readonly ACTIVE: "ACTIVE";
                readonly BLOCKED: "BLOCKED";
                readonly REJECTED: "REJECTED";
                readonly DELETED: "DELETED";
            }>;
        }, "strip", z.ZodTypeAny, {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REJECTED" | "DELETED";
        }, {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REJECTED" | "DELETED";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REJECTED" | "DELETED";
        };
    }, {
        body: {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REJECTED" | "DELETED";
        };
    }>;
};
//# sourceMappingURL=user.zod-validation.d.ts.map
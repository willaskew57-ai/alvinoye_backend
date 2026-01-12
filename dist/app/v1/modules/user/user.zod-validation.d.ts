import { z } from 'zod/v3';
export declare const UserValidation: {
    createUserValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodString;
            email: z.ZodString;
            password: z.ZodString;
            role: z.ZodEnum<["SUPER_ADMIN", "ADMIN", "CUSTOMER", "DRIVER"]>;
            phone_number: z.ZodOptional<z.ZodString>;
            profile_picture: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
        }, {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
        };
    }, {
        body: {
            full_name: string;
            email: string;
            password: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
        };
    }>;
    updateUserValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            full_name: z.ZodOptional<z.ZodString>;
            phone_number: z.ZodOptional<z.ZodString>;
            profile_picture: z.ZodOptional<z.ZodString>;
            is_blocked: z.ZodOptional<z.ZodBoolean>;
            is_verified: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
            is_blocked?: boolean | undefined;
            is_verified?: boolean | undefined;
        }, {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
            is_blocked?: boolean | undefined;
            is_verified?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
            is_blocked?: boolean | undefined;
            is_verified?: boolean | undefined;
        };
    }, {
        body: {
            full_name?: string | undefined;
            phone_number?: string | undefined;
            profile_picture?: string | undefined;
            is_blocked?: boolean | undefined;
            is_verified?: boolean | undefined;
        };
    }>;
    changeStatusValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodNativeEnum<{
                readonly PENDING: "PENDING";
                readonly ACTIVE: "ACTIVE";
                readonly BLOCKED: "BLOCKED";
                readonly REMOVED: "REMOVED";
                readonly DELETED: "DELETED";
            }>;
        }, "strip", z.ZodTypeAny, {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REMOVED" | "DELETED";
        }, {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REMOVED" | "DELETED";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REMOVED" | "DELETED";
        };
    }, {
        body: {
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REMOVED" | "DELETED";
        };
    }>;
};
//# sourceMappingURL=user.zod-validation.d.ts.map
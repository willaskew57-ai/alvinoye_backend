import { z } from 'zod/v3';
export declare const SettingValidation: {
    CreatePrivacyPolicyValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            content: string;
            title?: string | undefined;
        }, {
            content: string;
            title?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            content: string;
            title?: string | undefined;
        };
    }, {
        body: {
            content: string;
            title?: string | undefined;
        };
    }>;
    UpdatePrivacyPolicyValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            content: z.ZodOptional<z.ZodString>;
            updated_by: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
        }, "strip", z.ZodTypeAny, {
            title?: string | undefined;
            content?: string | undefined;
            updated_by?: string | undefined;
        }, {
            title?: string | undefined;
            content?: string | undefined;
            updated_by?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            title?: string | undefined;
            content?: string | undefined;
            updated_by?: string | undefined;
        };
    }, {
        body: {
            title?: string | undefined;
            content?: string | undefined;
            updated_by?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=settings.zod-validation.d.ts.map
import { z } from 'zod/v3';
export declare const faqValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodString;
            answer: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            question: string;
            answer: string;
        }, {
            question: string;
            answer: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            question: string;
            answer: string;
        };
    }, {
        body: {
            question: string;
            answer: string;
        };
    }>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            question: z.ZodOptional<z.ZodString>;
            answer: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            question?: string | undefined;
            answer?: string | undefined;
        }, {
            question?: string | undefined;
            answer?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            question?: string | undefined;
            answer?: string | undefined;
        };
    }, {
        body: {
            question?: string | undefined;
            answer?: string | undefined;
        };
    }>;
};
export declare const contentCreateValidation: z.ZodObject<{
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
export declare const contentUpdateValidation: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        content: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title?: string | undefined;
        content?: string | undefined;
    }, {
        title?: string | undefined;
        content?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
    };
}, {
    body: {
        title?: string | undefined;
        content?: string | undefined;
    };
}>;
//# sourceMappingURL=settings.validation.d.ts.map
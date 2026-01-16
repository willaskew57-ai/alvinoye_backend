import { z } from 'zod/v3';
export const faqValidation = {
    create: z.object({
        body: z.object({
            question: z.string({ required_error: 'Question is required' }),
            answer: z.string({ required_error: 'Answer is required' }),
        }),
    }),
    update: z.object({
        body: z.object({
            question: z.string().optional(),
            answer: z.string().optional(),
        }),
    }),
};
export const contentValidation = z.object({
    body: z.object({
        title: z.string().optional(),
        content: z.string({ required_error: 'Content is required' }),
    }),
});
//# sourceMappingURL=settings.validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentUpdateValidation = exports.contentCreateValidation = exports.faqValidation = void 0;
const v3_1 = require("zod/v3");
exports.faqValidation = {
    create: v3_1.z.object({
        body: v3_1.z.object({
            question: v3_1.z.string({ required_error: 'Question is required' }),
            answer: v3_1.z.string({ required_error: 'Answer is required' }),
        }),
    }),
    update: v3_1.z.object({
        body: v3_1.z.object({
            question: v3_1.z.string().optional(),
            answer: v3_1.z.string().optional(),
        }),
    }),
};
exports.contentCreateValidation = v3_1.z.object({
    body: v3_1.z.object({
        title: v3_1.z.string().optional(),
        content: v3_1.z.string({ required_error: 'Content is required' }),
    }),
});
exports.contentUpdateValidation = v3_1.z.object({
    body: v3_1.z.object({
        title: v3_1.z.string().optional(),
        content: v3_1.z.string({ required_error: 'Content is required' }).optional(),
    }),
});
//# sourceMappingURL=settings.validation.js.map
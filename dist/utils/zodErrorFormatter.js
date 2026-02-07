import { ZodError } from 'zod/v3';
export const formatZodError = (error) => {
    const errors = {};
    error.issues.forEach((issue) => {
        // Remove "body" from path for cleaner frontend keys
        const path = issue.path.filter(p => p !== 'body').join('.');
        // Keep only first error per field
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });
    return errors;
};
//# sourceMappingURL=zodErrorFormatter.js.map
import { ZodError } from 'zod/v3';
export const formatZodError = (error) => {
    const errors = {};
    error.issues.forEach((issue) => {
        const path = issue.path.filter((p) => p !== 'body').join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });
    return errors;
};
//# sourceMappingURL=zodErrorFormatter.js.map
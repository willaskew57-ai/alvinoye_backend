import { ZodError, type ZodIssue } from 'zod/v3';

export const formatZodError = (error: ZodError) => {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue: ZodIssue) => {
    // Remove "body" from path for cleaner frontend keys
    const path = issue.path.filter(p => p !== 'body').join('.');

    // Keep only first error per field
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return errors;
};

import { ZodError, type ZodIssue } from 'zod/v3';

export const formatZodError = (error: ZodError) => {
  const errors: Record<string, string> = {};

  error.issues.forEach((issue: ZodIssue) => {
    const path = issue.path.filter((p) => p !== 'body').join('.');

    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return errors;
};

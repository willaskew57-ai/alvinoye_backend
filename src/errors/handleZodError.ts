import httpStatus from 'http-status';
import { ZodError } from 'zod';
import type { ISendErrorResponse } from '../interfaces/errors';

const handleZodError = (err: ZodError): ISendErrorResponse => {
  const errorSources = err.issues.map((issue) => {
    const path = String(issue.path[issue.path.length - 1] ?? 'unknown');

    return {
      path,
      message: issue.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Validation Error!',
    errorSources,
  };
};

export default handleZodError;

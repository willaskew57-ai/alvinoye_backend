import httpStatus from 'http-status';
import type { IErrorSources, ISendErrorResponse } from '../interfaces/errors';

const handleDuplicateError = (err: any): ISendErrorResponse => {
  const keyPattern = err.keyPattern || {};
  const key = Object.keys(keyPattern)[0] as string;
  const keyValue = err.keyValue?.[key] as string | number | undefined;
  
  const errorSources: IErrorSources[] = [
    {
      path: key || 'unknown',
      message: `"${keyValue || 'this value'}" already exists`,
    },
  ];
  
  const statusCode = httpStatus.BAD_REQUEST;

  return {
    statusCode,
    message: `Duplicate field value: ${key || 'unknown'} already exists`,
    errorSources,
  };
};

export default handleDuplicateError;

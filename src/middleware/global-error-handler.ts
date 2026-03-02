// ** import packages
import type { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';

// ** import local files
import configs from '../config/env.config';
import type { IErrorSources } from '../interfaces/errors';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handle-validation-error';
import handleCastError from '../errors/handle-cast-error';
import handleDuplicateError from '../errors/handle-duplicate-error';
import AppError from '../errors/app-error';

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string = 'Something Went Wrong!!!';

  let errorSources: IErrorSources[] = [
    {
      path: '',
      message: 'Something went wrong!!!',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
  }

  return res.status(statusCode).send({
    success: false,
    message,
    errorSources,
    // err,
    stack: configs.node_env === 'development' ? err.stack : null,
  });
};

export default globalErrorHandler;

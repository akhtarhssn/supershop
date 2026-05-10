/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { handleZodError } from '../errors/handleZodError';
import { IErrorSources } from '../interface/error.interface';
import { handleValidationError } from '../errors/handleValidationError';
import { handleCastError } from '../errors/handleCastError';
import { handleDuplicateError } from '../errors/handleDuplicateError';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('ERROR DETECTED:', err);

  // setting default values
  let statusCode = 500;
  let message = 'Something went wrong';

  let errorSources: IErrorSources = [
    {
      path: '',
      message: 'Something went wrong 2',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);

    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err?.name === 'JsonWebTokenError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'You are not authorized';
  } else if (err?.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'jwt expired';
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message,
    errorSources,

    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

/* Error Patters

  Success:
  Message:
  ErrorSources: [{Path, Message}]
  
*/

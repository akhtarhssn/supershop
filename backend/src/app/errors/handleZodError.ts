import { ZodError, ZodIssue } from 'zod';
import { IErrorSources } from '../interface/error.interface';

export const handleZodError = (err: ZodError) => {
  const errorSources: IErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue?.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation failure',
    errorSources,
  };
};

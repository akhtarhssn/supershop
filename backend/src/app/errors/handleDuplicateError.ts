/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IErrorSources,
  IGenericErrorResponse,
} from '../interface/error.interface';

export const handleDuplicateError = (err: any): IGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const extracted_message = match && match[1];

  const errorSources: IErrorSources = [
    {
      path: err.keyValue,
      message: `${extracted_message} already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Error',
    errorSources,
  };
};

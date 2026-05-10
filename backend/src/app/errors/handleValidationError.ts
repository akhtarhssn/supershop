import mongoose from 'mongoose';
import {
  IErrorSources,
  IGenericErrorResponse,
} from '../interface/error.interface';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
  const errorSources: IErrorSources = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation failure',
    errorSources,
  };
};

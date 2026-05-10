import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = (asyncFunction: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(asyncFunction(req, res, next)).catch((err) => next(err));
  };
};

export default catchAsync;

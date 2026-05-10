import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { role, userId, iat } = decoded;
    const isUserExist = await User.findById(userId);

    const isDeleted = isUserExist?.isDeleted;
    const status = isUserExist?.status;

    if (!isUserExist || isDeleted === true || status !== 'Active') {
      throw new AppError(
        !isUserExist ? httpStatus.NOT_FOUND : httpStatus.FORBIDDEN,
        `${
          (!isUserExist && 'User not found !') ||
          (isDeleted && 'This user is deleted !!!') ||
          'The user is blocked !!!'
        }`,
      );
    }

    if (
      isUserExist.passwordChangedAt &&
      User.JwtIssueBeforePassChange(
        isUserExist.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Login with your new password!!',
      );
    }
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized to perform this action',
      );
    }

    (req as any).user = decoded as JwtPayload & { userId: string };
    next();
  });
};

export default auth;

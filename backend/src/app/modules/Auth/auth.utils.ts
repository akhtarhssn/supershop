import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

export const CreateToken = (
  jwtPayload: { userId: string; role: string },
  secret: Secret,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

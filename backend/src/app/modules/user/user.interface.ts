/* eslint-disable no-unused-vars */
import { Model, ObjectId } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface IUser {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  password?: string;
  needPasswordChange: boolean;
  passwordChangedAt?: Date;
  // forgotPasswordTokenTime?: Date;
  passwordResetVersion?: number;
  role: 'superAdmin' | 'admin' | 'seller' | 'buyer';
  status: 'Active' | 'Blocked';
  isDeleted: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

// Custom static methods:
export interface UserModel extends Model<IUser> {
  userExists(id: string): Promise<IUser | null>;
  isPasswordMatch(plainPass: string, hashedPass: string): Promise<boolean>;
  JwtIssueBeforePassChange(
    passwordChangedTimeStamp: Date,
    jwtIssueTimeStamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;

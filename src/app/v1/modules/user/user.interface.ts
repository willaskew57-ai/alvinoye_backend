/* eslint-disable no-unused-vars */
import e from 'express';
import { Model, Types } from 'mongoose';

// Enums as Constants
export const USER_ROLE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  DRIVER: 'DRIVER',
} as const;

export const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
  REMOVED: 'REMOVED',
  DELETED: 'DELETED',
} as const;

// Types derived from constants
export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = keyof typeof USER_STATUS;

export interface TUser extends Document {
  _id?: Types.ObjectId;
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  profile_picture?: string;
  role: TUserRole;
  status: TUserStatus;
  is_profile_completed: boolean;

  // Auth Logic
  password_changed_at?: Date;
  
  // Moderation & Soft Deletion
  removed_by?: Types.ObjectId | null;
  blocked_by?: Types.ObjectId | null;
  deleted_date?: Date | null;

  // Audit
  created_at?: Date;
  updated_at?: Date;
}

export interface IUserModel extends Model<TUser> {
  isUserExistsById(id: string): Promise<TUser | null>;
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Status Checks
  isUserActive(user: TUser): Promise<boolean>;
  isUserBlocked(user: TUser): Promise<boolean>;
  isUserDeleted(user: TUser): Promise<boolean>;

  // Auth & Security
  compareUserPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamps: Date | undefined,
    jwtIssuedTimeStamps: number
  ): boolean;
}

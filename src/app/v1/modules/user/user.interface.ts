/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

// Role type based on your updated requirements
export type TUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER' | 'DRIVER';


export type TUser = {
  _id?: Types.ObjectId; // Mongoose internal ID
  full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  profile_picture?: string;
  role: TUserRole;
  is_profile_completed: boolean;

  // Auth Logic
  password_changed_at?: Date;

  // Workflow Dates
  request_date?: Date;
  accepted_date?: Date;
  rejected_date?: Date;

  // Moderation & Soft Deletion
  is_verified: boolean;
  is_blocked: boolean;
  blocked_by?: Types.ObjectId;
  is_deleted: boolean;
  deleted_date?: Date;

  // Audit
  created_at?: Date;
  updated_at?: Date;
};

export interface IUserModel extends Model<TUser> {
   isUserExistsById(id: string): Promise<TUser | null>;
  // Check existence by email (as per your schema logic)
  isUserExistsByEmail(email: string): Promise<TUser | null>;

  // Check if user is deleted or removed
  isUserDeleted(user: TUser): Promise<boolean>;

  // Check if user is blocked
  isUserBlocked(user: TUser): Promise<boolean>;

  // Compare plain text password with hashed password
  compareUserPassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;

  // Check if password was changed after the JWT was issued
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimeStamps: Date | undefined,
    jwtIssuedTimeStamps: number
  ): boolean;
}

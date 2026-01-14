import { Model, Types } from 'mongoose';
export declare const USER_ROLE: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
    readonly CUSTOMER: "CUSTOMER";
    readonly DRIVER: "DRIVER";
};
export declare const USER_STATUS: {
    readonly PENDING: "PENDING";
    readonly ACTIVE: "ACTIVE";
    readonly BLOCKED: "BLOCKED";
    readonly REMOVED: "REMOVED";
    readonly DELETED: "DELETED";
};
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
    is_verified: boolean;
    password_changed_at?: Date;
    removed_by?: Types.ObjectId | null;
    blocked_by?: Types.ObjectId | null;
    deleted_date?: Date | null;
    created_at?: Date;
    updated_at?: Date;
}
export interface IUserModel extends Model<TUser> {
    isUserExistsById(id: string): Promise<TUser | null>;
    isUserExistsByEmail(email: string): Promise<TUser | null>;
    isUserActive(user: TUser): Promise<boolean>;
    isUserBlocked(user: TUser): Promise<boolean>;
    isUserDeleted(user: TUser): Promise<boolean>;
    isUserVerified(user: TUser): Promise<boolean>;
    compareUserPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
    isJWTIssuedBeforePasswordChanged(passwordChangedTimeStamps: Date | undefined, jwtIssuedTimeStamps: number): boolean;
}
//# sourceMappingURL=user.interface.d.ts.map
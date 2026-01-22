import type { JwtPayload } from 'jsonwebtoken';
import type { IChangePassword, ILoginUser } from './auth.interface';
import type { TUser } from '../user/user.interface';
import type { Types } from 'mongoose';
export declare const AuthServices: {
    registerUser: (payload: TUser) => Promise<{
        user: import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    loginServices: (payload: ILoginUser) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            _id: Types.ObjectId | undefined;
            full_name: string;
            email: string;
            role: "SUPER_ADMIN" | "ADMIN" | "CUSTOMER" | "DRIVER";
            status: "PENDING" | "ACTIVE" | "BLOCKED" | "REJECTED" | "DELETED";
        };
    }>;
    verifyOtp: (payload: {
        otp: string;
        purpose: "REGISTER" | "RESET_PASSWORD";
    }, token: string) => Promise<null>;
    resendOtp: (payload: {
        email: string;
        purpose: "REGISTER" | "RESET_PASSWORD";
    }) => Promise<null>;
    changePasswordIntoDB: (userData: JwtPayload, payload: IChangePassword) => Promise<null>;
    refreshToken: (token: string) => Promise<{
        accessToken: string;
    }>;
    forgetPassword: (email: string) => Promise<{
        resetToken: string;
        user_id: Types.ObjectId | undefined;
    }>;
    resetPassword: (payload: {
        new_password: string;
    }, token: string) => Promise<null>;
};
//# sourceMappingURL=auth.services.d.ts.map
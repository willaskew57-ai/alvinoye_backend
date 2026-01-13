import { type TUser, type TUserStatus } from './user.interface';
import { Types } from 'mongoose';
export declare const UserServices: {
    createUserIntoDB: (payload: TUser) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    changeUserStatusInDB: (targetId: string, payload: {
        status: TUserStatus;
    }, performerId: string, performerRole: string) => Promise<(import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAllUsersFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getMeFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateMeIntoDB: (id: string, payload: Partial<TUser>) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getSingleUserFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateUserInDB: (id: string, payload: Partial<TUser>) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteUserFromDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TUser, {}, import("mongoose").DefaultSchemaOptions> & TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map
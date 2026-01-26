import type { TDriver } from './driver.interface';
import mongoose, { Types } from 'mongoose';
import type { TVehicle } from '../vehicle/vehicle.interface';
export declare const DriverServices: {
    addDriverInfoIntoDB: (payload: {
        driverInfo: TDriver;
        vehicle: TVehicle;
    }, userIdFromToken: string) => Promise<{
        driver: mongoose.Document<unknown, {}, TDriver, {}, mongoose.DefaultSchemaOptions> & TDriver & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        vehicle: mongoose.Document<unknown, {}, TVehicle, {}, mongoose.DefaultSchemaOptions> & TVehicle & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateDriverInfoInDB: (userId: string, payload: {
        driverInfo?: Partial<TDriver>;
        vehicle?: any;
    }) => Promise<(mongoose.Document<unknown, {}, TDriver, {}, mongoose.DefaultSchemaOptions> & TDriver & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getAllDriversFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("../user/user.interface").TUser, {}, mongoose.DefaultSchemaOptions> & import("../user/user.interface").TUser & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getSingleDriverFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("../user/user.interface").TUser, {}, mongoose.DefaultSchemaOptions> & import("../user/user.interface").TUser & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    acceptParcelFromDB: (parcelId: string, driverIdFromToken: string) => Promise<{
        message: string;
        parcel_id: Types.ObjectId;
        status: "ONGOING";
    }>;
    verifyParcelOtpFromDB: (payload: {
        parcel_id: string;
        otp: string;
    }) => Promise<{
        message: string;
        parcel_id: Types.ObjectId;
    }>;
    completeParcelFromDB: (parcel_id: string, driver_id: string) => Promise<{
        message: string;
        parcel_id: Types.ObjectId;
        status: "COMPLETED";
    }>;
};
//# sourceMappingURL=driver.service.d.ts.map
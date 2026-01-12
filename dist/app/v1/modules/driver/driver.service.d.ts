import type { TDriver } from './driver.interface';
import mongoose from 'mongoose';
import type { TVehicle } from '../vehicle/vehicle.interface';
export declare const DriverServices: {
    addDriverInfoIntoDB: (payload: {
        driverInfo: TDriver;
        vehicle: TVehicle;
    }, userIdFromToken: string) => Promise<{
        driver: (mongoose.Document<unknown, {}, TDriver, {}, mongoose.DefaultSchemaOptions> & TDriver & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | undefined;
        vehicle: (mongoose.Document<unknown, {}, TVehicle, {}, mongoose.DefaultSchemaOptions> & TVehicle & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | undefined;
    }>;
    getAllDriversFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("../user/user.interface").TUser, {}, mongoose.DefaultSchemaOptions> & import("../user/user.interface").TUser & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getSingleDriverFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, import("../user/user.interface").TUser, {}, mongoose.DefaultSchemaOptions> & import("../user/user.interface").TUser & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
};
//# sourceMappingURL=driver.service.d.ts.map
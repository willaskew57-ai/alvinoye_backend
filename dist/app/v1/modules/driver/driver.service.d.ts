import type { TDriver } from './driver.interface';
import mongoose, { Types } from 'mongoose';
import type { TVehicle } from '../vehicle/vehicle.interface';
export declare const DriverServices: {
    addDriverInfoIntoDB: (payload: {
        driverInfo: TDriver;
        vehicle: TVehicle;
    }, userIdFromToken: string) => Promise<{
        driver: (mongoose.Document<unknown, {}, TDriver, {}, mongoose.DefaultSchemaOptions> & TDriver & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | undefined;
        vehicle: (mongoose.Document<unknown, {}, TVehicle, {}, mongoose.DefaultSchemaOptions> & TVehicle & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }) | undefined;
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
        status: "COMPLETED";
    }>;
    getAvailableParcelsFromDB: (userId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            discoveryMode: string;
            distanceToSavedRoute?: never;
            isOnRoute?: never;
        };
        data: never[];
    } | {
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            discoveryMode: string;
            distanceToSavedRoute: number;
            isOnRoute: boolean;
        };
        data: any[];
    }>;
    selectParcelFromDB: (payload: {
        parcel_id: string;
        driverId: string;
        routeContext?: {
            fromLat: number;
            fromLng: number;
            toLat?: number;
            toLng?: number;
            routePolyline?: string;
        };
    }) => Promise<{
        parcel_id: Types.ObjectId;
        status: "ONGOING";
        pickup_location: import("../parcel/parcel.interface").TLocation;
        dropoff_location: import("../parcel/parcel.interface").TLocation;
        routeInjectionPoints: {
            pickup: {
                location: import("../parcel/parcel.interface").TLocation;
                type: string;
            };
            dropoff: {
                location: import("../parcel/parcel.interface").TLocation;
                type: string;
            };
            originalRoute: {
                fromLat: number;
                fromLng: number;
                toLat: number | undefined;
                toLng: number | undefined;
            };
        } | null;
    }>;
};
//# sourceMappingURL=driver.service.d.ts.map
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
    }>;
    completeParcelFromDB: (parcel_id: string, driver_id: string) => Promise<{
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
        };
        data: {
            distance_info: {
                parcel_actual_distance: any;
            };
            parcel_id: string;
            user_id: Types.ObjectId;
            parcel_name: string;
            size: string;
            vehicle_type: string;
            weight: number;
            pickup_location: import("../parcel/parcel.interface").TLocation;
            handover_location: import("../parcel/parcel.interface").TLocation;
            priority: string;
            date: string;
            time: string;
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks: string;
            status: import("../parcel/parcel.interface").TParcelStatus;
            final_price: number | null;
            price_status: import("../parcel/parcel.interface").TPriceStatus;
            rejection_reason?: string;
            accepted_by: Types.ObjectId | null;
            accepted_at: Date | null;
            completed_at: Date | null;
            stripe_checkout_session_id?: string | null;
            _id: Types.ObjectId;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: mongoose.Collection;
            db: mongoose.Connection;
            errors?: mongoose.Error.ValidationError;
            isNew: boolean;
            schema: mongoose.Schema;
            __v: number;
        }[];
    }>;
};
//# sourceMappingURL=driver.service.d.ts.map
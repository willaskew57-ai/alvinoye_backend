import mongoose from 'mongoose';
import { type TParcel, type TParcelPriceRequest, type TPriceRequestStatus } from './parcel.interface';
import type { TUserPayload } from '../../../../interfaces';
export declare const ParcelServices: {
    createParcelIntoDB: (userId: string, payload: TParcel) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllParcelsFromDB: (query: Record<string, unknown>, user: TUserPayload) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getMyParcelsFromDB: (query: Record<string, unknown>, userId: string, role: string) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getSingleParcelFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateParcelInDB: (id: string, payload: Partial<TParcel>) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectParcelFromDB: (id: string, payload: {
        rejection_reason: string;
    }) => Promise<(mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    proposePriceInDB: (userId: string, role: string, payload: Partial<TParcelPriceRequest>) => Promise<(mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    acceptPriceProposalInDB: (requestId: string, status: TPriceRequestStatus, user: {
        user_id: string;
        role: string;
    }) => Promise<mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectAndCounterPriceInDB: (requestId: string, payload: {
        parcel_id: string;
        rejection_reason: string;
        suggested_price: number;
    }) => Promise<(mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    adminRejectAndFinalOfferInDB: (requestId: string, payload: {
        parcel_id: string;
        final_price: number;
        message?: string;
    }) => Promise<(mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
};
//# sourceMappingURL=parcel.service.d.ts.map
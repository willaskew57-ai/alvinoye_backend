import mongoose from 'mongoose';
import type { TParcel, TParcelPriceRequest } from './parcel.interface';
import type { TUserPayload } from '../../../../interfaces';
export declare const ParcelServices: {
    createParcelIntoDB: (userId: string, payload: TParcel) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & {
        _id: mongoose.Types.ObjectId;
    } & {
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
        data: (mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getSingleParcelFromDB: (id: string) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateParcelInDB: (id: string, payload: Partial<TParcel>) => Promise<mongoose.Document<unknown, {}, TParcel, {}, mongoose.DefaultSchemaOptions> & TParcel & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    proposePriceInDB: (userId: string, role: string, payload: TParcelPriceRequest) => Promise<(mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | undefined>;
    respondToPriceProposalInDB: (requestId: string, status: "Accepted" | "Rejected", userId: string) => Promise<mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPriceHistoryFromDB: (parcelId: string) => Promise<(mongoose.Document<unknown, {}, TParcelPriceRequest, {}, mongoose.DefaultSchemaOptions> & TParcelPriceRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=parcel.service.d.ts.map
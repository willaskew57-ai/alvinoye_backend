import type { TParcel, TParcelPriceRequest } from './parcel.interface';
export declare const Parcel: import("mongoose").Model<TParcel, {}, {}, {}, import("mongoose").Document<unknown, {}, TParcel, {}, import("mongoose").DefaultSchemaOptions> & TParcel & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TParcel>;
export declare const ParcelPriceRequest: import("mongoose").Model<TParcelPriceRequest, {}, {}, {}, import("mongoose").Document<unknown, {}, TParcelPriceRequest, {}, import("mongoose").DefaultSchemaOptions> & TParcelPriceRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TParcelPriceRequest>;
//# sourceMappingURL=parcel.model.d.ts.map
import { Types, Document } from 'mongoose';
export declare const PARCEL_STATUS: {
    readonly WAITING: "WAITING";
    readonly PENDING: "PENDING";
    readonly ONGOING: "ONGOING";
    readonly COMPLETED: "COMPLETED";
    readonly REJECTED: "REJECTED";
};
export declare const PRICE_STATUS: {
    readonly NOT_SET: "NOT_SET";
    readonly PROPOSED: "PROPOSED";
    readonly COUNTERED: "COUNTERED";
    readonly FINAL_OFFER: "FINAL_OFFER";
    readonly ACCEPTED: "ACCEPTED";
    readonly REJECTED: "REJECTED";
};
export declare const PROPOSED_BY: {
    readonly ADMIN: "ADMIN";
    readonly CUSTOMER: "CUSTOMER";
};
export declare const PRICE_REQUEST_STATUS: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly REJECTED: "REJECTED";
};
export type TParcelStatus = (typeof PARCEL_STATUS)[keyof typeof PARCEL_STATUS];
export type TPriceStatus = (typeof PRICE_STATUS)[keyof typeof PRICE_STATUS];
export type TProposedBy = (typeof PROPOSED_BY)[keyof typeof PROPOSED_BY];
export type TPriceRequestStatus = (typeof PRICE_REQUEST_STATUS)[keyof typeof PRICE_REQUEST_STATUS];
export interface TParcel extends Document {
    parcel_id: string;
    user_id: Types.ObjectId;
    parcel_name: string;
    size: string;
    vehicle_type: string;
    weight: number;
    handover_location: string;
    priority: string;
    date: string;
    time: string;
    parcel_images: string[];
    receiver_name: string;
    receiver_phone: string;
    sender_remarks?: string;
    status: TParcelStatus;
    final_price?: number | null;
    price_status: TPriceStatus;
    accepted_by?: Types.ObjectId | null;
    accepted_at?: Date | null;
    completed_at?: Date | null;
}
export interface TParcelPriceRequest extends Document {
    parcel_id: Types.ObjectId;
    proposed_by: TProposedBy;
    proposed_price: number;
    message?: string;
    rejection_reason?: string | null;
    is_final_offer: boolean;
    status: TPriceRequestStatus;
    decided_at?: Date;
}
//# sourceMappingURL=parcel.interface.d.ts.map
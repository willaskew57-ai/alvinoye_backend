import { Types, Document } from 'mongoose';
export interface TLocation {
    address: string;
    latitude: number;
    longitude: number;
}
export declare const PARCEL_STATUS: {
    readonly INITIAL: "INITIAL";
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
export declare const PRICE_TYPE: {
    readonly PROPOSED: "PROPOSED";
    readonly COUNTERED: "COUNTERED";
    readonly FINAL_OFFER: "FINAL_OFFER";
};
export declare const PROPOSED_BY: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
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
export type TPriceType = (typeof PRICE_TYPE)[keyof typeof PRICE_TYPE];
export type TProposedBy = (typeof PROPOSED_BY)[keyof typeof PROPOSED_BY];
export type TPriceRequestStatus = (typeof PRICE_REQUEST_STATUS)[keyof typeof PRICE_REQUEST_STATUS];
export interface TParcel extends Document {
    parcel_id: string;
    user_id: Types.ObjectId;
    parcel_name: string;
    size: string;
    vehicle_type: string;
    weight: number;
    pickup_location: TLocation;
    handover_location: TLocation;
    priority: string;
    date: string;
    time: string;
    parcel_images: string[];
    receiver_name: string;
    receiver_phone: string;
    sender_remarks: string;
    status: TParcelStatus;
    final_price: number | null;
    price_status: TPriceStatus;
    rejection_reason?: string;
    accepted_by: Types.ObjectId | null;
    accepted_at: Date | null;
    completed_at: Date | null;
    stripe_checkout_session_id?: string | null;
    is_paid: boolean;
    paid_at: Date | null;
}
export interface TParcelPriceRequest extends Document {
    parcel_id: Types.ObjectId;
    proposed_by: TProposedBy;
    price_type: TPriceType;
    proposed_price: number;
    message?: string;
    rejection_reason?: string | null;
    is_final_offer: boolean;
    status: TPriceRequestStatus;
    decided_at?: Date;
}
//# sourceMappingURL=parcel.interface.d.ts.map
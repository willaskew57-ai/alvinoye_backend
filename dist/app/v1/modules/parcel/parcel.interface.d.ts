import { Types } from 'mongoose';
export type TParcelStatus = 'Waiting' | 'Pending' | 'Ongoing' | 'Completed' | 'Rejected';
export type TPriceStatus = 'NotSet' | 'Proposed' | 'Countered' | 'Accepted' | 'Rejected';
export type TProposedBy = 'Admin' | 'Customer';
export type TParcel = {
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
    final_price?: number;
    price_status: TPriceStatus;
    accepted_by?: Types.ObjectId;
    accepted_at?: Date;
};
export type TParcelPriceRequest = {
    parcel_id: Types.ObjectId;
    proposed_by: TProposedBy;
    proposed_price: number;
    message?: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
    decided_at?: Date;
};
//# sourceMappingURL=parcel.interface.d.ts.map
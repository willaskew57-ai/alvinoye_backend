import { Types } from 'mongoose';
export type TLocation = {
    address: string;
    latitude: number;
    longitude: number;
};
export type TDriver = {
    user_id: Types.ObjectId;
    from: TLocation;
    to: TLocation;
    driver_license_number: string;
    license_image: string;
    stops: string;
    daily_commute_time: string;
    available_for_delivery: string;
    max_parcel_weight: string;
    pickup_time: string;
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
};
//# sourceMappingURL=driver.interface.d.ts.map
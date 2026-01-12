import type { Types } from "mongoose";

export type TLocation = {
  address: string;
  latitude: number;
  longitude: number;
};

export type TDriver = {
  user_id: Types.ObjectId;
  from: TLocation;
  to: TLocation;
  stops: TLocation[]; // Array of locations
  driver_license_number: string;
  license_image: string;
  daily_commute_time: string;
  available_for_delivery: string;
  max_parcel_weight: string;
  pickup_time: string;
  notes?: string;
};

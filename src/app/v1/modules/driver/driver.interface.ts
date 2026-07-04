import type { Types } from 'mongoose';

export type TLocation = {
  address: string;
  latitude: number;
  longitude: number;
};

export type TBankDetails = {
  bank_name: string;
  account_number: string;
  account_holder_name: string;
};

export type TDriver = {
  user_id: Types.ObjectId;
  from: TLocation;
  to: TLocation;
  // stops: TLocation[];
  driver_license_number: string;
  license_image: string;
  daily_commute_time: string;
  max_parcel_weight: string;
  notes?: string;
  // Payout destination used for wallet withdrawals.
  bank_details?: TBankDetails;
};

import { Types } from 'mongoose';

export type TOtpPurpose =
  | 'REGISTER'
  | 'RESET_PASSWORD'
  | 'PARCEL';

export type TOtp = {
  user?: Types.ObjectId;        // optional for parcel
  parcel?: Types.ObjectId;      // parcel reference
  otp_hash: string;
  purpose: TOtpPurpose;
  expires_at?: Date;            // OPTIONAL now
  attempts: number;
  is_used: boolean;
  created_at: Date;
};

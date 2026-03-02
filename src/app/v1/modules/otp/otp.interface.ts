import { Types } from 'mongoose';

export type TOtpPurpose =
  | 'REGISTER'
  | 'RESET_PASSWORD'
  | 'PARCEL';

export type TOtp = {
  user?: Types.ObjectId;        
  parcel?: Types.ObjectId;     
  otp_hash: string;
  purpose: TOtpPurpose;
  expires_at?: Date;           
  attempts: number;
  is_used: boolean;
  created_at: Date;
};

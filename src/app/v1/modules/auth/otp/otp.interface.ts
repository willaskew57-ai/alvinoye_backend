import { Types } from 'mongoose';

export type TOtp = {
  user: Types.ObjectId;
  otp_hash: string;
  purpose: 'REGISTER' | 'RESET_PASSWORD';
  expires_at: Date;
  attempts: number;
  is_used: boolean;
  created_at: Date;
};
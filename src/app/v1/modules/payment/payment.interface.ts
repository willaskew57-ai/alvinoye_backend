// src/app/v1/modules/payment/payment.interface.ts
import { Document, Types } from 'mongoose';
import { PAYMENT_STATUS } from './payment.constants';

export interface TPayment extends Document {
  user_id: Types.ObjectId;
  parcel_id: Types.ObjectId;

  transaction_id: string;
  transaction_amount: number; // Use parseFloat for Decimal128
  currency: string;
  status: PAYMENT_STATUS;
  payment_method: string;

  // Which gateway processed this payment. Defaults to 'stripe' so existing
  // records remain valid.
  gateway: 'stripe' | 'dpo';
  // DPO TransRef (human-readable reference returned alongside the token).
  dpo_trans_ref?: string | null;

  refund_id: string | null;
  refunded_at: Date | null;

  created_at: Date;
  updated_at: Date;
}

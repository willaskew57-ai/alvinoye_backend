import { Types, Document } from 'mongoose';

// Enums as Constants
export const PARCEL_STATUS = {
  WAITING: 'WAITING',
  PENDING: 'PENDING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
} as const;

export const PRICE_STATUS = {
  NOT_SET: 'NOT_SET',           // Initial creation
  PROPOSED: 'PROPOSED',         // Admin's first price
  COUNTERED: 'COUNTERED',       // User's counter offer
  FINAL_OFFER: 'FINAL_OFFER',   // Admin's second and last price offer
  ACCEPTED: 'ACCEPTED',         // Negotiation successful
  REJECTED: 'REJECTED',         // Negotiation failed
} as const;

export const PROPOSED_BY = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const;

export const PRICE_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;

// Derived Types
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
  // Price Negotiation
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
  message?: string;             // Message or reason for counter/rejection
  rejection_reason?: string | null;
  is_final_offer: boolean;      // To identify the "Final Price" from Admin
  status: TPriceRequestStatus;
  decided_at?: Date;
}
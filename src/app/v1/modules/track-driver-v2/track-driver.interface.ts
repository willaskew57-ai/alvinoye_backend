import { Document, Types } from 'mongoose';

export interface TCoordinates {
  latitude: number;
  longitude: number;
}

export interface TDriverLocation extends Document {
  _id: Types.ObjectId;
  driver_id: Types.ObjectId;
  parcel_id?: Types.ObjectId;

  latitude: number;
  longitude: number;

  heading?: number;
  speed?: number;
  accuracy?: number;

  is_online: boolean;
  last_updated: Date;

  created_at?: Date;
  updated_at?: Date;
}

export interface IUpdateLocation {
  driver_id: string | Types.ObjectId;
  latitude: number;
  longitude: number;
  parcel_id?: string | Types.ObjectId;
  heading?: number;
  speed?: number;
  accuracy?: number;
}

export interface ILocationHistory {
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number | undefined;
  heading: number | undefined;
}

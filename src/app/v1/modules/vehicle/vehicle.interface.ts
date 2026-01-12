import { Types } from 'mongoose';

export interface TVehicle {
  user_id: Types.ObjectId;
  vehicle_type: string;
  vehicle_number: string;
  number_plate_image: string;
  vehicle_images: string[];
  is_deleted?: boolean;
}

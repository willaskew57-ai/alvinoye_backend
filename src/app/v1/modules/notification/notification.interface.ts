import { Document, Types } from 'mongoose';
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  NOTIFICATION_PRIORITY,
} from './notification.constant';

export type TNotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
export type TNotificationStatus =
  (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS];
export type TNotificationPriority =
  (typeof NOTIFICATION_PRIORITY)[keyof typeof NOTIFICATION_PRIORITY];

export interface TNotification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: TNotificationType;
  title: string;
  message: string;
  status: TNotificationStatus;
  priority: TNotificationPriority;

  parcel_id?: Types.ObjectId;
  price_request_id?: Types.ObjectId;
  payment_id?: Types.ObjectId;
  chat_id?: Types.ObjectId;

  action_url?: string;
  data?: Record<string, any>;

  read_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICreateNotification {
  user_id: string | Types.ObjectId;
  type: TNotificationType;
  title: string;
  message: string;
  priority?: TNotificationPriority;
  parcel_id?: string | Types.ObjectId;
  price_request_id?: string | Types.ObjectId;
  payment_id?: string | Types.ObjectId;
  chat_id?: string | Types.ObjectId;
  action_url?: string;
  data?: Record<string, any>;
}

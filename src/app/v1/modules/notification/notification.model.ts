import { Schema, model } from 'mongoose';
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  NOTIFICATION_PRIORITY,
} from './notification.constant';
import type { TNotification } from './notification.interface';

const NotificationSchema = new Schema<TNotification>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_TYPE),
        message: '{VALUE} is not a valid notification type',
      },
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_STATUS),
        message: '{VALUE} is not a valid status',
      },
      default: NOTIFICATION_STATUS.UNREAD,
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(NOTIFICATION_PRIORITY),
        message: '{VALUE} is not a valid priority',
      },
      default: NOTIFICATION_PRIORITY.MEDIUM,
    },
    
    // Related References
    parcel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Parcel',
    },
    price_request_id: {
      type: Schema.Types.ObjectId,
      ref: 'ParcelPriceRequest',
    },
    payment_id: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    chat_id: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    
    // Metadata
    action_url: {
      type: String,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    
    // Timestamps
    read_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for performance
NotificationSchema.index({ user_id: 1, status: 1 });
NotificationSchema.index({ user_id: 1, created_at: -1 });
NotificationSchema.index({ created_at: -1 });

export const Notification = model<TNotification>(
  'Notification',
  NotificationSchema
);

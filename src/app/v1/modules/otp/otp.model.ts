import { Schema, model, Types } from 'mongoose';
import type { TOtp } from './otp.interface';

const OtpSchema = new Schema<TOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },

    parcel: {
      type: Schema.Types.ObjectId,
      ref: 'Parcel',
      required: false,
      index: true,
    },

    otp_hash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ['REGISTER', 'RESET_PASSWORD', 'PARCEL'],
      required: true,
      index: true,
    },

    expires_at: {
      type: Date,
      required: false,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    is_used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: false,
    },
  }
);

/**
 * TTL index ONLY applies when expires_at exists
 */
OtpSchema.index(
  { expires_at: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      expires_at: { $exists: true },
    },
  }
);

export const Otp = model<TOtp>('Otp', OtpSchema);
export default Otp;

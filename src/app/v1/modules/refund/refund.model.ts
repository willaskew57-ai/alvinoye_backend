// refund.model.ts
import { Schema, model } from 'mongoose';
import { REFUND_STATUS } from './refund.constants';

const refundSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    parcel_id: { type: Schema.Types.ObjectId, ref: 'Parcel', required: true },

    reason: { type: String, required: true },
    admin_note: { type: String, default: null },

    status: {
      type: String,
      enum: Object.values(REFUND_STATUS),
      default: REFUND_STATUS.PENDING,
    },

    stripe_refund_id: { type: String, default: null },
    refunded_at: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const RefundRequest = model('RefundRequest', refundSchema);

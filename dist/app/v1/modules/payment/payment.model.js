import { Schema, model } from 'mongoose';
import { PAYMENT_STATUS } from './payment.constants';
const paymentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parcel_id: { type: Schema.Types.ObjectId, ref: 'Parcel', required: true },
    transaction_id: { type: String, required: true, unique: true },
    transaction_amount: { type: Schema.Types.Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING,
    },
    payment_method: { type: String, default: 'card' },
    refund_id: { type: String, default: null },
    refunded_at: { type: Date, default: null },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
export const Payment = model('Payment', paymentSchema);
//# sourceMappingURL=payment.model.js.map
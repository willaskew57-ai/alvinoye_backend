import { Document, Types } from 'mongoose';
import { PAYMENT_STATUS } from './payment.constants';
export interface TPayment extends Document {
    user_id: Types.ObjectId;
    parcel_id: Types.ObjectId;
    transaction_id: string;
    transaction_amount: number;
    currency: string;
    status: PAYMENT_STATUS;
    payment_method: string;
    refund_id: string | null;
    refunded_at: Date | null;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=payment.interface.d.ts.map
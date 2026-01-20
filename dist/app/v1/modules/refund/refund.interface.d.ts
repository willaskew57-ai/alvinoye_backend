import { Types } from 'mongoose';
import type { REFUND_STATUS } from './refund.constants';
export interface TRefundRequest {
    user_id: Types.ObjectId;
    payment_id: Types.ObjectId;
    parcel_id: Types.ObjectId;
    reason: string;
    admin_note?: string;
    status: REFUND_STATUS;
    stripe_refund_id?: string;
    refunded_at?: Date;
}
//# sourceMappingURL=refund.interface.d.ts.map
import { Types } from 'mongoose';
export type TReview = {
    parcel_id: Types.ObjectId;
    customer_id: Types.ObjectId;
    driver_id: Types.ObjectId;
    rating: number;
    feedback: string;
};
//# sourceMappingURL=review.interface.d.ts.map
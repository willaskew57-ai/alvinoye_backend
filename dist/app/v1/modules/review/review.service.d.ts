import { Types } from 'mongoose';
export declare const ReviewService: {
    createReview: (customerId: string, payload: {
        parcel_id: string;
        rating: number;
        feedback: string;
    }) => Promise<import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, import("mongoose").DefaultSchemaOptions> & import("./review.interface").TReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getDriverReviews: (driverId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, import("mongoose").DefaultSchemaOptions> & import("./review.interface").TReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
};
//# sourceMappingURL=review.service.d.ts.map
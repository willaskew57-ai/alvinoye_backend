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
    getSingleReviewFromDB: (review_id: string) => Promise<import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, import("mongoose").DefaultSchemaOptions> & import("./review.interface").TReview & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getDriverReviewsFromDB: (driverId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
        average_rating: number;
        result: (import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, import("mongoose").DefaultSchemaOptions> & import("./review.interface").TReview & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getCustomerReviewsFromDB: (customerId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        result: (import("mongoose").Document<unknown, {}, import("./review.interface").TReview, {}, import("mongoose").DefaultSchemaOptions> & import("./review.interface").TReview & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
};
//# sourceMappingURL=review.service.d.ts.map
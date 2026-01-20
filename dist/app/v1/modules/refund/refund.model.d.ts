import { Schema } from 'mongoose';
import { REFUND_STATUS } from './refund.constants';
export declare const RefundRequest: import("mongoose").Model<{
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, {
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps, import("mongoose").Document<unknown, {}, {
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & Omit<{
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
} & import("mongoose").DefaultTimestampProps & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    [path: string]: import("mongoose").SchemaDefinitionProperty<undefined, any, any>;
} | {
    [x: string]: import("mongoose").SchemaDefinitionProperty<any, any, import("mongoose").Document<unknown, {}, {
        status: REFUND_STATUS;
        user_id: import("mongoose").Types.ObjectId;
        parcel_id: import("mongoose").Types.ObjectId;
        reason: string;
        payment_id: import("mongoose").Types.ObjectId;
        refunded_at?: NativeDate | null;
        admin_note?: string | null;
        stripe_refund_id?: string | null;
    } & import("mongoose").DefaultTimestampProps, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<{
        timestamps: true;
    }>> & Omit<{
        status: REFUND_STATUS;
        user_id: import("mongoose").Types.ObjectId;
        parcel_id: import("mongoose").Types.ObjectId;
        reason: string;
        payment_id: import("mongoose").Types.ObjectId;
        refunded_at?: NativeDate | null;
        admin_note?: string | null;
        stripe_refund_id?: string | null;
    } & import("mongoose").DefaultTimestampProps & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, {
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>, {
    status: REFUND_STATUS;
    user_id: import("mongoose").Types.ObjectId;
    parcel_id: import("mongoose").Types.ObjectId;
    reason: string;
    payment_id: import("mongoose").Types.ObjectId;
    refunded_at?: NativeDate | null;
    admin_note?: string | null;
    stripe_refund_id?: string | null;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=refund.model.d.ts.map
import { Schema } from 'mongoose';
import { REFUND_STATUS } from './refund.constants';
import type { TRefundRequest } from './refund.interface';
export declare const RefundRequest: import("mongoose").Model<TRefundRequest, {}, {}, {
    id: string;
}, import("mongoose").Document<unknown, {}, TRefundRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, Schema<TRefundRequest, import("mongoose").Model<TRefundRequest, any, any, any, (import("mongoose").Document<unknown, any, TRefundRequest, any, import("mongoose").DefaultSchemaOptions> & TRefundRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, TRefundRequest, any, import("mongoose").DefaultSchemaOptions> & TRefundRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, TRefundRequest>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user_id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    parcel_id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    reason?: import("mongoose").SchemaDefinitionProperty<string, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    admin_note?: import("mongoose").SchemaDefinitionProperty<string | undefined, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    status?: import("mongoose").SchemaDefinitionProperty<REFUND_STATUS, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    stripe_refund_id?: import("mongoose").SchemaDefinitionProperty<string | undefined, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    refunded_at?: import("mongoose").SchemaDefinitionProperty<Date | undefined, TRefundRequest, import("mongoose").Document<unknown, {}, TRefundRequest, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<TRefundRequest & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, TRefundRequest>, TRefundRequest>;
//# sourceMappingURL=refund.model.d.ts.map
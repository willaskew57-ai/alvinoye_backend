import mongoose from 'mongoose';
export declare const RefundServices: {
    createRefundRequest: (userId: string, parcelId: string, reason: string) => Promise<mongoose.Document<unknown, {}, import("./refund.interface").TRefundRequest, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<import("./refund.interface").TRefundRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    getAllRefundsFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("./refund.interface").TRefundRequest, {
            id: string;
        }, mongoose.DefaultSchemaOptions> & Omit<import("./refund.interface").TRefundRequest & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        }, "id"> & {
            id: string;
        })[];
    }>;
    processRefundDecision: (requestId: string, payload: {
        action: "APPROVE" | "REJECT";
        adminNote: string;
    }) => Promise<mongoose.Document<unknown, {}, import("./refund.interface").TRefundRequest, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<import("./refund.interface").TRefundRequest & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
};
//# sourceMappingURL=refund.service.d.ts.map
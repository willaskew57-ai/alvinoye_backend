import { z } from 'zod/v3';
export declare const ParcelValidations: {
    createParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_name: z.ZodString;
            size: z.ZodString;
            vehicle_type: z.ZodString;
            weight: z.ZodNumber;
            handover_location: z.ZodString;
            priority: z.ZodString;
            date: z.ZodString;
            time: z.ZodString;
            parcel_images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            receiver_name: z.ZodString;
            receiver_phone: z.ZodString;
            sender_remarks: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            size: string;
            time: string;
            vehicle_type: string;
            parcel_name: string;
            weight: number;
            handover_location: string;
            priority: string;
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks?: string | undefined;
        }, {
            date: string;
            size: string;
            time: string;
            vehicle_type: string;
            parcel_name: string;
            weight: number;
            handover_location: string;
            priority: string;
            receiver_name: string;
            receiver_phone: string;
            parcel_images?: string[] | undefined;
            sender_remarks?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            date: string;
            size: string;
            time: string;
            vehicle_type: string;
            parcel_name: string;
            weight: number;
            handover_location: string;
            priority: string;
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks?: string | undefined;
        };
    }, {
        body: {
            date: string;
            size: string;
            time: string;
            vehicle_type: string;
            parcel_name: string;
            weight: number;
            handover_location: string;
            priority: string;
            receiver_name: string;
            receiver_phone: string;
            parcel_images?: string[] | undefined;
            sender_remarks?: string | undefined;
        };
    }>;
    updateParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_name: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodString>;
            vehicle_type: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            handover_location: z.ZodOptional<z.ZodString>;
            priority: z.ZodOptional<z.ZodString>;
            date: z.ZodOptional<z.ZodString>;
            time: z.ZodOptional<z.ZodString>;
            parcel_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            receiver_name: z.ZodOptional<z.ZodString>;
            receiver_phone: z.ZodOptional<z.ZodString>;
            sender_remarks: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<["Waiting", "Pending", "Ongoing", "Completed", "Rejected"]>>;
        }, "strip", z.ZodTypeAny, {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            vehicle_type?: string | undefined;
            parcel_name?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            priority?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        }, {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            vehicle_type?: string | undefined;
            parcel_name?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            priority?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            vehicle_type?: string | undefined;
            parcel_name?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            priority?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        };
    }, {
        body: {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            vehicle_type?: string | undefined;
            parcel_name?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            priority?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        };
    }>;
    createPriceRequestValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_id: z.ZodString;
            proposed_price: z.ZodNumber;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            parcel_id: string;
            proposed_price: number;
            message?: string | undefined;
        }, {
            parcel_id: string;
            proposed_price: number;
            message?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            parcel_id: string;
            proposed_price: number;
            message?: string | undefined;
        };
    }, {
        body: {
            parcel_id: string;
            proposed_price: number;
            message?: string | undefined;
        };
    }>;
    respondPriceRequestValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodEnum<["Accepted", "Rejected"]>;
        }, "strip", z.ZodTypeAny, {
            status: "Rejected" | "Accepted";
        }, {
            status: "Rejected" | "Accepted";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status: "Rejected" | "Accepted";
        };
    }, {
        body: {
            status: "Rejected" | "Accepted";
        };
    }>;
    adminUpdateParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodOptional<z.ZodEnum<["Waiting", "Pending", "Ongoing", "Completed", "Rejected"]>>;
            final_price: z.ZodOptional<z.ZodNumber>;
            price_status: z.ZodOptional<z.ZodEnum<["NotSet", "Proposed", "Countered", "Accepted", "Rejected"]>>;
        }, "strip", z.ZodTypeAny, {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            final_price?: number | undefined;
            price_status?: "Rejected" | "NotSet" | "Proposed" | "Countered" | "Accepted" | undefined;
        }, {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            final_price?: number | undefined;
            price_status?: "Rejected" | "NotSet" | "Proposed" | "Countered" | "Accepted" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            final_price?: number | undefined;
            price_status?: "Rejected" | "NotSet" | "Proposed" | "Countered" | "Accepted" | undefined;
        };
    }, {
        body: {
            status?: "Waiting" | "Pending" | "Ongoing" | "Completed" | "Rejected" | undefined;
            final_price?: number | undefined;
            price_status?: "Rejected" | "NotSet" | "Proposed" | "Countered" | "Accepted" | undefined;
        };
    }>;
};
//# sourceMappingURL=parcel.validation.d.ts.map
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
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: string;
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks?: string | undefined;
        }, {
            date: string;
            size: string;
            time: string;
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: string;
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
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: string;
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
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: string;
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
        }, "strip", z.ZodTypeAny, {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        }, {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: string | undefined;
        };
    }, {
        body: {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: string | undefined;
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
    customerRejectAndCounterValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_id: z.ZodString;
            rejection_reason: z.ZodString;
            suggested_price: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            parcel_id: string;
            rejection_reason: string;
            suggested_price: number;
        }, {
            parcel_id: string;
            rejection_reason: string;
            suggested_price: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            parcel_id: string;
            rejection_reason: string;
            suggested_price: number;
        };
    }, {
        body: {
            parcel_id: string;
            rejection_reason: string;
            suggested_price: number;
        };
    }>;
    adminRejectAndFinalOfferValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_id: z.ZodString;
            final_price: z.ZodNumber;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            parcel_id: string;
            final_price: number;
            message?: string | undefined;
        }, {
            parcel_id: string;
            final_price: number;
            message?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            parcel_id: string;
            final_price: number;
            message?: string | undefined;
        };
    }, {
        body: {
            parcel_id: string;
            final_price: number;
            message?: string | undefined;
        };
    }>;
    acceptPriceRequestValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodEnum<["ACCEPTED"]>;
        }, "strip", z.ZodTypeAny, {
            status: "ACCEPTED";
        }, {
            status: "ACCEPTED";
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status: "ACCEPTED";
        };
    }, {
        body: {
            status: "ACCEPTED";
        };
    }>;
    adminUpdateParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            status: z.ZodOptional<z.ZodNativeEnum<{
                readonly WAITING: "WAITING";
                readonly PENDING: "PENDING";
                readonly ONGOING: "ONGOING";
                readonly COMPLETED: "COMPLETED";
                readonly REJECTED: "REJECTED";
            }>>;
            final_price: z.ZodOptional<z.ZodNumber>;
            price_status: z.ZodOptional<z.ZodNativeEnum<{
                readonly NOT_SET: "NOT_SET";
                readonly PROPOSED: "PROPOSED";
                readonly COUNTERED: "COUNTERED";
                readonly FINAL_OFFER: "FINAL_OFFER";
                readonly ACCEPTED: "ACCEPTED";
                readonly REJECTED: "REJECTED";
            }>>;
        }, "strip", z.ZodTypeAny, {
            status?: "PENDING" | "WAITING" | "ONGOING" | "COMPLETED" | "REJECTED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        }, {
            status?: "PENDING" | "WAITING" | "ONGOING" | "COMPLETED" | "REJECTED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status?: "PENDING" | "WAITING" | "ONGOING" | "COMPLETED" | "REJECTED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        };
    }, {
        body: {
            status?: "PENDING" | "WAITING" | "ONGOING" | "COMPLETED" | "REJECTED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        };
    }>;
};
//# sourceMappingURL=parcel.validation.d.ts.map
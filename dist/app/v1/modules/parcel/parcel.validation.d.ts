import { z } from 'zod/v3';
export declare const createParcelValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        parcel_name: z.ZodString;
        size: z.ZodString;
        vehicle_type: z.ZodString;
        weight: z.ZodNumber;
        handover_location: z.ZodObject<{
            address: z.ZodString;
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            address: string;
            latitude: number;
            longitude: number;
        }, {
            address: string;
            latitude: number;
            longitude: number;
        }>;
        priority: z.ZodString;
        date: z.ZodString;
        time: z.ZodString;
        parcel_images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        receiver_name: z.ZodString;
        receiver_phone: z.ZodString;
        sender_remarks: z.ZodObject<{
            address: z.ZodString;
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            address: string;
            latitude: number;
            longitude: number;
        }, {
            address: string;
            latitude: number;
            longitude: number;
        }>;
    }, "strip", z.ZodTypeAny, {
        date: string;
        size: string;
        time: string;
        priority: string;
        parcel_name: string;
        vehicle_type: string;
        weight: number;
        handover_location: {
            address: string;
            latitude: number;
            longitude: number;
        };
        parcel_images: string[];
        receiver_name: string;
        receiver_phone: string;
        sender_remarks: {
            address: string;
            latitude: number;
            longitude: number;
        };
    }, {
        date: string;
        size: string;
        time: string;
        priority: string;
        parcel_name: string;
        vehicle_type: string;
        weight: number;
        handover_location: {
            address: string;
            latitude: number;
            longitude: number;
        };
        receiver_name: string;
        receiver_phone: string;
        sender_remarks: {
            address: string;
            latitude: number;
            longitude: number;
        };
        parcel_images?: string[] | undefined;
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
        handover_location: {
            address: string;
            latitude: number;
            longitude: number;
        };
        parcel_images: string[];
        receiver_name: string;
        receiver_phone: string;
        sender_remarks: {
            address: string;
            latitude: number;
            longitude: number;
        };
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
        handover_location: {
            address: string;
            latitude: number;
            longitude: number;
        };
        receiver_name: string;
        receiver_phone: string;
        sender_remarks: {
            address: string;
            latitude: number;
            longitude: number;
        };
        parcel_images?: string[] | undefined;
    };
}>;
export declare const updateParcelValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        parcel_name: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodString>;
        vehicle_type: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodNumber>;
        handover_location: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            latitude: z.ZodOptional<z.ZodNumber>;
            longitude: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        }, {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        }>>;
        priority: z.ZodOptional<z.ZodString>;
        date: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodString>;
        parcel_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        receiver_name: z.ZodOptional<z.ZodString>;
        receiver_phone: z.ZodOptional<z.ZodString>;
        sender_remarks: z.ZodOptional<z.ZodObject<{
            address: z.ZodOptional<z.ZodString>;
            latitude: z.ZodOptional<z.ZodNumber>;
            longitude: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        }, {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        date?: string | undefined;
        size?: string | undefined;
        time?: string | undefined;
        priority?: string | undefined;
        parcel_name?: string | undefined;
        vehicle_type?: string | undefined;
        weight?: number | undefined;
        handover_location?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
        parcel_images?: string[] | undefined;
        receiver_name?: string | undefined;
        receiver_phone?: string | undefined;
        sender_remarks?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
    }, {
        date?: string | undefined;
        size?: string | undefined;
        time?: string | undefined;
        priority?: string | undefined;
        parcel_name?: string | undefined;
        vehicle_type?: string | undefined;
        weight?: number | undefined;
        handover_location?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
        parcel_images?: string[] | undefined;
        receiver_name?: string | undefined;
        receiver_phone?: string | undefined;
        sender_remarks?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
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
        handover_location?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
        parcel_images?: string[] | undefined;
        receiver_name?: string | undefined;
        receiver_phone?: string | undefined;
        sender_remarks?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
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
        handover_location?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
        parcel_images?: string[] | undefined;
        receiver_name?: string | undefined;
        receiver_phone?: string | undefined;
        sender_remarks?: {
            address?: string | undefined;
            latitude?: number | undefined;
            longitude?: number | undefined;
        } | undefined;
    };
}>;
export declare const ParcelValidations: {
    createParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_name: z.ZodString;
            size: z.ZodString;
            vehicle_type: z.ZodString;
            weight: z.ZodNumber;
            handover_location: z.ZodObject<{
                address: z.ZodString;
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                address: string;
                latitude: number;
                longitude: number;
            }, {
                address: string;
                latitude: number;
                longitude: number;
            }>;
            priority: z.ZodString;
            date: z.ZodString;
            time: z.ZodString;
            parcel_images: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
            receiver_name: z.ZodString;
            receiver_phone: z.ZodString;
            sender_remarks: z.ZodObject<{
                address: z.ZodString;
                latitude: z.ZodNumber;
                longitude: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                address: string;
                latitude: number;
                longitude: number;
            }, {
                address: string;
                latitude: number;
                longitude: number;
            }>;
        }, "strip", z.ZodTypeAny, {
            date: string;
            size: string;
            time: string;
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: {
                address: string;
                latitude: number;
                longitude: number;
            };
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks: {
                address: string;
                latitude: number;
                longitude: number;
            };
        }, {
            date: string;
            size: string;
            time: string;
            priority: string;
            parcel_name: string;
            vehicle_type: string;
            weight: number;
            handover_location: {
                address: string;
                latitude: number;
                longitude: number;
            };
            receiver_name: string;
            receiver_phone: string;
            sender_remarks: {
                address: string;
                latitude: number;
                longitude: number;
            };
            parcel_images?: string[] | undefined;
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
            handover_location: {
                address: string;
                latitude: number;
                longitude: number;
            };
            parcel_images: string[];
            receiver_name: string;
            receiver_phone: string;
            sender_remarks: {
                address: string;
                latitude: number;
                longitude: number;
            };
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
            handover_location: {
                address: string;
                latitude: number;
                longitude: number;
            };
            receiver_name: string;
            receiver_phone: string;
            sender_remarks: {
                address: string;
                latitude: number;
                longitude: number;
            };
            parcel_images?: string[] | undefined;
        };
    }>;
    updateParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_name: z.ZodOptional<z.ZodString>;
            size: z.ZodOptional<z.ZodString>;
            vehicle_type: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            handover_location: z.ZodOptional<z.ZodObject<{
                address: z.ZodOptional<z.ZodString>;
                latitude: z.ZodOptional<z.ZodNumber>;
                longitude: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            }, {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            }>>;
            priority: z.ZodOptional<z.ZodString>;
            date: z.ZodOptional<z.ZodString>;
            time: z.ZodOptional<z.ZodString>;
            parcel_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            receiver_name: z.ZodOptional<z.ZodString>;
            receiver_phone: z.ZodOptional<z.ZodString>;
            sender_remarks: z.ZodOptional<z.ZodObject<{
                address: z.ZodOptional<z.ZodString>;
                latitude: z.ZodOptional<z.ZodNumber>;
                longitude: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            }, {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
        }, {
            date?: string | undefined;
            size?: string | undefined;
            time?: string | undefined;
            priority?: string | undefined;
            parcel_name?: string | undefined;
            vehicle_type?: string | undefined;
            weight?: number | undefined;
            handover_location?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
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
            handover_location?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
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
            handover_location?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
            parcel_images?: string[] | undefined;
            receiver_name?: string | undefined;
            receiver_phone?: string | undefined;
            sender_remarks?: {
                address?: string | undefined;
                latitude?: number | undefined;
                longitude?: number | undefined;
            } | undefined;
        };
    }>;
    rejectParcelValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            rejection_reason: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            rejection_reason: string;
        }, {
            rejection_reason: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            rejection_reason: string;
        };
    }, {
        body: {
            rejection_reason: string;
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
            status?: "PENDING" | "REJECTED" | "WAITING" | "ONGOING" | "COMPLETED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        }, {
            status?: "PENDING" | "REJECTED" | "WAITING" | "ONGOING" | "COMPLETED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            status?: "PENDING" | "REJECTED" | "WAITING" | "ONGOING" | "COMPLETED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        };
    }, {
        body: {
            status?: "PENDING" | "REJECTED" | "WAITING" | "ONGOING" | "COMPLETED" | undefined;
            final_price?: number | undefined;
            price_status?: "REJECTED" | "NOT_SET" | "PROPOSED" | "COUNTERED" | "FINAL_OFFER" | "ACCEPTED" | undefined;
        };
    }>;
};
//# sourceMappingURL=parcel.validation.d.ts.map
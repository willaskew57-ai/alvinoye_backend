import { z } from 'zod/v3';
export declare const DriverValidation: {
    createDriverWithVehicleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            driverInfo: z.ZodObject<{
                user_id: z.ZodOptional<z.ZodString>;
                from: z.ZodObject<{
                    address: z.ZodString;
                    latitude: z.ZodString;
                    longitude: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }>;
                to: z.ZodObject<{
                    address: z.ZodString;
                    latitude: z.ZodString;
                    longitude: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }>;
                driver_license_number: z.ZodString;
                license_image: z.ZodOptional<z.ZodString>;
                daily_commute_time: z.ZodString;
                max_parcel_weight: z.ZodString;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            }, {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            }>;
            vehicle: z.ZodObject<Omit<{
                user_id: z.ZodOptional<z.ZodString>;
                vehicle_type: z.ZodString;
                vehicle_number: z.ZodString;
                number_plate_image: z.ZodOptional<z.ZodString>;
                vehicle_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "user_id">, "strip", z.ZodTypeAny, {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            }, {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            }>;
        }, "strip", z.ZodTypeAny, {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            };
        }, {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            };
        };
    }, {
        body: {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                from: {
                    address: string;
                    latitude: string;
                    longitude: string;
                };
                driver_license_number: string;
                daily_commute_time: string;
                max_parcel_weight: string;
                user_id?: string | undefined;
                license_image?: string | undefined;
                notes?: string | undefined;
            };
        };
    }>;
    updateDriverWithVehicleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            driverInfo: z.ZodOptional<z.ZodObject<{
                from: z.ZodOptional<z.ZodObject<{
                    address: z.ZodString;
                    latitude: z.ZodString;
                    longitude: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }>>;
                to: z.ZodOptional<z.ZodObject<{
                    address: z.ZodString;
                    latitude: z.ZodString;
                    longitude: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }>>;
                stops: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    address: z.ZodString;
                    latitude: z.ZodString;
                    longitude: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }, {
                    address: string;
                    latitude: string;
                    longitude: string;
                }>, "many">>;
                driver_license_number: z.ZodOptional<z.ZodString>;
                license_image: z.ZodOptional<z.ZodString>;
                daily_commute_time: z.ZodOptional<z.ZodString>;
                max_parcel_weight: z.ZodOptional<z.ZodString>;
                pickup_time: z.ZodOptional<z.ZodString>;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            }, {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            }>>;
            vehicle: z.ZodOptional<z.ZodObject<{
                vehicle_type: z.ZodOptional<z.ZodString>;
                vehicle_number: z.ZodOptional<z.ZodString>;
                number_plate_image: z.ZodOptional<z.ZodString>;
                vehicle_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                existing_vehicle_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            }, {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            vehicle?: {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            } | undefined;
            driverInfo?: {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            } | undefined;
        }, {
            vehicle?: {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            } | undefined;
            driverInfo?: {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            } | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vehicle?: {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            } | undefined;
            driverInfo?: {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            } | undefined;
        };
    }, {
        body: {
            vehicle?: {
                vehicle_type?: string | undefined;
                number_plate_image?: string | undefined;
                vehicle_images?: string[] | undefined;
                vehicle_number?: string | undefined;
                existing_vehicle_images?: string[] | undefined;
            } | undefined;
            driverInfo?: {
                to?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                license_image?: string | undefined;
                from?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                } | undefined;
                driver_license_number?: string | undefined;
                daily_commute_time?: string | undefined;
                max_parcel_weight?: string | undefined;
                notes?: string | undefined;
                stops?: {
                    address: string;
                    latitude: string;
                    longitude: string;
                }[] | undefined;
                pickup_time?: string | undefined;
            } | undefined;
        };
    }>;
    verifyParcelOtpValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            parcel_id: z.ZodString;
            otp: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            parcel_id: string;
            otp: string;
        }, {
            parcel_id: string;
            otp: string;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            parcel_id: string;
            otp: string;
        };
    }, {
        body: {
            parcel_id: string;
            otp: string;
        };
    }>;
};
//# sourceMappingURL=driver.validation.d.ts.map
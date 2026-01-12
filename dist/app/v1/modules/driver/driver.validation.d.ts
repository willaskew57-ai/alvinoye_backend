import { z } from 'zod/v3';
export declare const DriverValidation: {
    driverInfoValidationSchema: z.ZodObject<{
        user_id: z.ZodOptional<z.ZodString>;
        from: z.ZodObject<{
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
        to: z.ZodObject<{
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
        driver_license_number: z.ZodString;
        license_image: z.ZodString;
        stops: z.ZodOptional<z.ZodString>;
        daily_commute_time: z.ZodString;
        available_for_delivery: z.ZodString;
        max_parcel_weight: z.ZodString;
        pickup_time: z.ZodString;
        notes: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        to: {
            address: string;
            latitude: number;
            longitude: number;
        };
        from: {
            address: string;
            latitude: number;
            longitude: number;
        };
        driver_license_number: string;
        license_image: string;
        daily_commute_time: string;
        available_for_delivery: string;
        max_parcel_weight: string;
        pickup_time: string;
        user_id?: string | undefined;
        stops?: string | undefined;
        notes?: string | undefined;
    }, {
        to: {
            address: string;
            latitude: number;
            longitude: number;
        };
        from: {
            address: string;
            latitude: number;
            longitude: number;
        };
        driver_license_number: string;
        license_image: string;
        daily_commute_time: string;
        available_for_delivery: string;
        max_parcel_weight: string;
        pickup_time: string;
        user_id?: string | undefined;
        stops?: string | undefined;
        notes?: string | undefined;
    }>;
    updateDriverValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            from: z.ZodOptional<z.ZodString>;
            to: z.ZodOptional<z.ZodString>;
            driver_license_number: z.ZodOptional<z.ZodString>;
            license_image: z.ZodOptional<z.ZodString>;
            stops: z.ZodOptional<z.ZodString>;
            daily_commute_time: z.ZodOptional<z.ZodString>;
            available_for_delivery: z.ZodOptional<z.ZodString>;
            max_parcel_weight: z.ZodOptional<z.ZodString>;
            pickup_time: z.ZodOptional<z.ZodString>;
            notes: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            to?: string | undefined;
            from?: string | undefined;
            driver_license_number?: string | undefined;
            license_image?: string | undefined;
            stops?: string | undefined;
            daily_commute_time?: string | undefined;
            available_for_delivery?: string | undefined;
            max_parcel_weight?: string | undefined;
            pickup_time?: string | undefined;
            notes?: string | undefined;
        }, {
            to?: string | undefined;
            from?: string | undefined;
            driver_license_number?: string | undefined;
            license_image?: string | undefined;
            stops?: string | undefined;
            daily_commute_time?: string | undefined;
            available_for_delivery?: string | undefined;
            max_parcel_weight?: string | undefined;
            pickup_time?: string | undefined;
            notes?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            to?: string | undefined;
            from?: string | undefined;
            driver_license_number?: string | undefined;
            license_image?: string | undefined;
            stops?: string | undefined;
            daily_commute_time?: string | undefined;
            available_for_delivery?: string | undefined;
            max_parcel_weight?: string | undefined;
            pickup_time?: string | undefined;
            notes?: string | undefined;
        };
    }, {
        body: {
            to?: string | undefined;
            from?: string | undefined;
            driver_license_number?: string | undefined;
            license_image?: string | undefined;
            stops?: string | undefined;
            daily_commute_time?: string | undefined;
            available_for_delivery?: string | undefined;
            max_parcel_weight?: string | undefined;
            pickup_time?: string | undefined;
            notes?: string | undefined;
        };
    }>;
    createDriverWithVehicleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            driverInfo: z.ZodObject<{
                user_id: z.ZodOptional<z.ZodString>;
                from: z.ZodObject<{
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
                to: z.ZodObject<{
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
                driver_license_number: z.ZodString;
                license_image: z.ZodString;
                stops: z.ZodOptional<z.ZodString>;
                daily_commute_time: z.ZodString;
                available_for_delivery: z.ZodString;
                max_parcel_weight: z.ZodString;
                pickup_time: z.ZodString;
                notes: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            }, {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            }>;
            vehicle: z.ZodObject<Omit<{
                user_id: z.ZodOptional<z.ZodString>;
                vehicle_type: z.ZodString;
                vehicle_number: z.ZodString;
                number_plate_image: z.ZodString;
                vehicle_images: z.ZodArray<z.ZodString, "atleastone">;
            }, "user_id">, "strip", z.ZodTypeAny, {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            }, {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            }>;
        }, "strip", z.ZodTypeAny, {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            };
        }, {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            };
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            };
        };
    }, {
        body: {
            vehicle: {
                vehicle_type: string;
                vehicle_number: string;
                number_plate_image: string;
                vehicle_images: [string, ...string[]];
            };
            driverInfo: {
                to: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                from: {
                    address: string;
                    latitude: number;
                    longitude: number;
                };
                driver_license_number: string;
                license_image: string;
                daily_commute_time: string;
                available_for_delivery: string;
                max_parcel_weight: string;
                pickup_time: string;
                user_id?: string | undefined;
                stops?: string | undefined;
                notes?: string | undefined;
            };
        };
    }>;
};
//# sourceMappingURL=driver.validation.d.ts.map
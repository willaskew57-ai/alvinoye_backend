import { z } from 'zod/v3';
export declare const TrackDriverValidation: {
    getNearbyDriversQuerySchema: z.ZodObject<{
        query: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            radius: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
            radius: number;
        }, {
            latitude: number;
            longitude: number;
            radius?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        query: {
            latitude: number;
            longitude: number;
            radius: number;
        };
    }, {
        query: {
            latitude: number;
            longitude: number;
            radius?: number | undefined;
        };
    }>;
    updateLocationValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
            parcel_id: z.ZodOptional<z.ZodString>;
            heading: z.ZodOptional<z.ZodNumber>;
            speed: z.ZodOptional<z.ZodNumber>;
            accuracy: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
            parcel_id?: string | undefined;
            heading?: number | undefined;
            speed?: number | undefined;
            accuracy?: number | undefined;
        }, {
            latitude: number;
            longitude: number;
            parcel_id?: string | undefined;
            heading?: number | undefined;
            speed?: number | undefined;
            accuracy?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            latitude: number;
            longitude: number;
            parcel_id?: string | undefined;
            heading?: number | undefined;
            speed?: number | undefined;
            accuracy?: number | undefined;
        };
    }, {
        body: {
            latitude: number;
            longitude: number;
            parcel_id?: string | undefined;
            heading?: number | undefined;
            speed?: number | undefined;
            accuracy?: number | undefined;
        };
    }>;
};
//# sourceMappingURL=track-driver.validation.d.ts.map
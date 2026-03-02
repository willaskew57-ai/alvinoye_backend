import { z } from 'zod/v3';
const getNearbyDriversQuerySchema = z.object({
    query: z.object({
        latitude: z.coerce
            .number({ required_error: 'Latitude is required' })
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90'),
        longitude: z.coerce
            .number({ required_error: 'Longitude is required' })
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180'),
        radius: z.coerce
            .number()
            .positive('Radius must be a positive number')
            .optional()
            .default(10),
    }),
});
const updateLocationValidationSchema = z.object({
    body: z.object({
        latitude: z
            .number({ required_error: 'Latitude is required' })
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90'),
        longitude: z
            .number({ required_error: 'Longitude is required' })
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180'),
        parcel_id: z.string().optional(),
        heading: z
            .number()
            .min(0, 'Heading must be at least 0')
            .max(360, 'Heading cannot exceed 360')
            .optional(),
        speed: z.number().min(0, 'Speed cannot be negative').optional(),
        accuracy: z.number().min(0, 'Accuracy cannot be negative').optional(),
    }),
});
export const TrackDriverValidation = {
    getNearbyDriversQuerySchema,
    updateLocationValidationSchema
};
//# sourceMappingURL=track-driver.validation.js.map
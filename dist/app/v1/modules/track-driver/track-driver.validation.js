"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDriverValidation = void 0;
const v3_1 = require("zod/v3");
const getNearbyDriversQuerySchema = v3_1.z.object({
    query: v3_1.z.object({
        latitude: v3_1.z.coerce
            .number({ required_error: 'Latitude is required' })
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90'),
        longitude: v3_1.z.coerce
            .number({ required_error: 'Longitude is required' })
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180'),
        radius: v3_1.z.coerce
            .number()
            .positive('Radius must be a positive number')
            .optional()
            .default(10),
    }),
});
const updateLocationValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        latitude: v3_1.z
            .number({ required_error: 'Latitude is required' })
            .min(-90, 'Latitude must be between -90 and 90')
            .max(90, 'Latitude must be between -90 and 90'),
        longitude: v3_1.z
            .number({ required_error: 'Longitude is required' })
            .min(-180, 'Longitude must be between -180 and 180')
            .max(180, 'Longitude must be between -180 and 180'),
        parcel_id: v3_1.z.string().optional(),
        heading: v3_1.z
            .number()
            .min(0, 'Heading must be at least 0')
            .max(360, 'Heading cannot exceed 360')
            .optional(),
        speed: v3_1.z.number().min(0, 'Speed cannot be negative').optional(),
        accuracy: v3_1.z.number().min(0, 'Accuracy cannot be negative').optional(),
    }),
});
exports.TrackDriverValidation = {
    getNearbyDriversQuerySchema,
    updateLocationValidationSchema
};
//# sourceMappingURL=track-driver.validation.js.map
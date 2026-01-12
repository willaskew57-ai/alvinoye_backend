import { z } from 'zod/v3';
export declare const VehicleValidation: {
    createVehicleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            user_id: z.ZodOptional<z.ZodString>;
            vehicle_type: z.ZodString;
            vehicle_number: z.ZodString;
            number_plate_image: z.ZodString;
            vehicle_images: z.ZodArray<z.ZodString, "atleastone">;
        }, "strip", z.ZodTypeAny, {
            vehicle_type: string;
            vehicle_number: string;
            number_plate_image: string;
            vehicle_images: [string, ...string[]];
            user_id?: string | undefined;
        }, {
            vehicle_type: string;
            vehicle_number: string;
            number_plate_image: string;
            vehicle_images: [string, ...string[]];
            user_id?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vehicle_type: string;
            vehicle_number: string;
            number_plate_image: string;
            vehicle_images: [string, ...string[]];
            user_id?: string | undefined;
        };
    }, {
        body: {
            vehicle_type: string;
            vehicle_number: string;
            number_plate_image: string;
            vehicle_images: [string, ...string[]];
            user_id?: string | undefined;
        };
    }>;
};
//# sourceMappingURL=vehicle.validation.d.ts.map
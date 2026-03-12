import { z } from 'zod/v3';
export declare const VehicleValidation: {
    createVehicleValidationSchema: z.ZodObject<{
        body: z.ZodObject<{
            user_id: z.ZodOptional<z.ZodString>;
            vehicle_type: z.ZodString;
            vehicle_number: z.ZodString;
            number_plate_image: z.ZodOptional<z.ZodString>;
            vehicle_images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            vehicle_type: string;
            vehicle_number: string;
            user_id?: string | undefined;
            number_plate_image?: string | undefined;
            vehicle_images?: string[] | undefined;
        }, {
            vehicle_type: string;
            vehicle_number: string;
            user_id?: string | undefined;
            number_plate_image?: string | undefined;
            vehicle_images?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        body: {
            vehicle_type: string;
            vehicle_number: string;
            user_id?: string | undefined;
            number_plate_image?: string | undefined;
            vehicle_images?: string[] | undefined;
        };
    }, {
        body: {
            vehicle_type: string;
            vehicle_number: string;
            user_id?: string | undefined;
            number_plate_image?: string | undefined;
            vehicle_images?: string[] | undefined;
        };
    }>;
};
//# sourceMappingURL=vehicle.validation.d.ts.map
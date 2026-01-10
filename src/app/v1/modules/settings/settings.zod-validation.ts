import { z } from 'zod/v3';

// Helper for validating MongoDB ObjectIds
const objectIdSchema = z
  .string()
  .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  });

const CreatePrivacyPolicyValidationSchema = z.object({
    body: z.object({
      title: z
        .string()
        .max(255, "Title cannot exceed 255 characters")
        .optional(),
      content: z
        .string({
          required_error: "Content is required",
        })
        .min(1, "Content cannot be empty"),
    }),
  })

const UpdatePrivacyPolicyValidationSchema = z.object({
  body: z.object({
    title: z
      .string()
      .max(255, "Title cannot exceed 255 characters")
      .optional(),
    content: z.string().min(1, "Content cannot be empty").optional(),
    updated_by: objectIdSchema.optional(),
  }),
})

export const SettingValidation = {
  CreatePrivacyPolicyValidationSchema,
  UpdatePrivacyPolicyValidationSchema,
};


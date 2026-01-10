import { z } from 'zod/v3';

const createUserValidationSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: 'Full name is required' }),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'DRIVER']),
    phone_number: z.string().optional(),
    profile_picture: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    full_name: z.string().optional(),
    phone_number: z.string().optional(),
    profile_picture: z.string().optional(),
    is_blocked: z.boolean().optional(),
    is_verified: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
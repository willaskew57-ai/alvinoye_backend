import { z } from 'zod/v3';
import { USER_STATUS } from './user.interface';

const createUserValidationSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: 'Full name is required' }),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6),
  }),
});
const createAdminValidationSchema = z.object({
  body: z.object({
    full_name: z.string({ required_error: 'Full name is required' }),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    full_name: z.string().optional(),
    phone_number: z.string().optional(),
    profile_picture: z.string().optional(),
    address: z.string().optional(),
  }),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.nativeEnum(USER_STATUS, {
      required_error: 'Status is required',
      invalid_type_error: 'Invalid status value',
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  createAdminValidationSchema,
  updateUserValidationSchema,
  changeStatusValidationSchema,
};

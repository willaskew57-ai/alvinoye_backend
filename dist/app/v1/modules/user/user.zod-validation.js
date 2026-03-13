"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const v3_1 = require("zod/v3");
const user_interface_1 = require("./user.interface");
const createUserValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        full_name: v3_1.z.string({ required_error: 'Full name is required' }),
        email: v3_1.z.string().email('Invalid email address'),
        password: v3_1.z.string().min(6),
    }),
});
const createAdminValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        full_name: v3_1.z.string({ required_error: 'Full name is required' }),
        email: v3_1.z.string().email('Invalid email address'),
        password: v3_1.z.string().min(6),
    }),
});
const updateUserValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        full_name: v3_1.z.string().optional(),
        phone_number: v3_1.z.string().optional(),
        profile_picture: v3_1.z.string().optional(),
        address: v3_1.z.string().optional(),
    }),
});
const changeStatusValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        status: v3_1.z.nativeEnum(user_interface_1.USER_STATUS, {
            required_error: 'Status is required',
            invalid_type_error: 'Invalid status value',
        }),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    createAdminValidationSchema,
    updateUserValidationSchema,
    changeStatusValidationSchema,
};
//# sourceMappingURL=user.zod-validation.js.map
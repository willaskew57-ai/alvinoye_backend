"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSuperAdmin = void 0;
const colors_1 = __importDefault(require("colors"));
const env_config_1 = __importDefault(require("../config/env.config"));
const user_model_1 = __importDefault(require("../app/v1/modules/user/user.model"));
const user_interface_1 = require("../app/v1/modules/user/user.interface");
/**
 * Ensure a SUPER_ADMIN account exists. Runs on startup; idempotent — if an
 * account with the configured email already exists nothing is changed.
 * Credentials come from SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD in .env.
 */
const seedSuperAdmin = async () => {
    try {
        const email = env_config_1.default.super_admin_email;
        const password = env_config_1.default.super_admin_password;
        if (!email || !password) {
            console.warn(colors_1.default.yellow('[seed] SUPER_ADMIN_EMAIL/PASSWORD not set; skipping'));
            return;
        }
        const existing = await user_model_1.default.findOne({ email });
        if (existing) {
            console.log(colors_1.default.gray(`[seed] Super admin already exists: ${email}`));
            return;
        }
        // password is hashed by the User pre('save') hook.
        await user_model_1.default.create({
            full_name: env_config_1.default.super_admin_name || 'Super Admin',
            email,
            password,
            role: user_interface_1.USER_ROLE.SUPER_ADMIN,
            status: user_interface_1.USER_STATUS.ACTIVE,
            is_verified: true,
            is_profile_completed: true,
        });
        console.log(colors_1.default.green(`[seed] Super admin created: ${email}`).bold);
    }
    catch (error) {
        console.error('[seed] Failed to seed super admin:', error);
    }
};
exports.seedSuperAdmin = seedSuperAdmin;
//# sourceMappingURL=seed-super-admin.js.map
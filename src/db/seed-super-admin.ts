import colors from 'colors';

import configs from '../config/env.config';
import User from '../app/v1/modules/user/user.model';
import { USER_ROLE, USER_STATUS } from '../app/v1/modules/user/user.interface';

/**
 * Ensure a SUPER_ADMIN account exists. Runs on startup; idempotent — if an
 * account with the configured email already exists nothing is changed.
 * Credentials come from SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD in .env.
 */
export const seedSuperAdmin = async (): Promise<void> => {
  try {
    const email = configs.super_admin_email;
    const password = configs.super_admin_password;

    if (!email || !password) {
      console.warn(
        colors.yellow('[seed] SUPER_ADMIN_EMAIL/PASSWORD not set; skipping')
      );
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      console.log(colors.gray(`[seed] Super admin already exists: ${email}`));
      return;
    }

    // password is hashed by the User pre('save') hook.
    await User.create({
      full_name: configs.super_admin_name || 'Super Admin',
      email,
      password,
      role: USER_ROLE.SUPER_ADMIN,
      status: USER_STATUS.ACTIVE,
      is_verified: true,
      is_profile_completed: true,
    } as any);

    console.log(
      colors.green(`[seed] Super admin created: ${email}`).bold
    );
  } catch (error) {
    console.error('[seed] Failed to seed super admin:', error);
  }
};

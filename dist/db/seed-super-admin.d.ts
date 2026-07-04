/**
 * Ensure a SUPER_ADMIN account exists. Runs on startup; idempotent — if an
 * account with the configured email already exists nothing is changed.
 * Credentials come from SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD in .env.
 */
export declare const seedSuperAdmin: () => Promise<void>;
//# sourceMappingURL=seed-super-admin.d.ts.map
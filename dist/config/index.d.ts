declare const configs: {
    node_env: string;
    port: string | number;
    database_url: string | undefined;
    bcrypt_salt_rounds: number;
    jwt_access_token: string;
    jwt_refresh_token: string | undefined;
    jwt_access_expiresIn: string | number;
    jwt_refresh_expiresIn: string | number;
    jwt_reset_token: string | undefined;
    jwt_reset_expiresIn: string | number;
    otp_expiry_minutes: number;
    smtp_host: string | undefined;
    smtp_port: string | undefined;
    smtp_service: string | undefined;
    smtp_mail: string | undefined;
    smtp_password: string | undefined;
    smtp_service_name: string | undefined;
};
export default configs;
//# sourceMappingURL=index.d.ts.map
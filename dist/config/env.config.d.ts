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
    stripe_secret_key: string;
    aws_access_key_id: string;
    aws_secret_access_key: string;
    aws_region: string;
    aws_s3_bucket_name: string;
    cloudfront_url: string;
    google_maps_api_key: string | undefined;
};
export default configs;
//# sourceMappingURL=env.config.d.ts.map
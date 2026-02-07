import dotenv from 'dotenv';
import path from 'path';
// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });
const configs = {
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URI || process.env.DATABASE_URI,
    bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12') || 12,
    // JWT configuration - using your provided JWT_SECRET
    jwt_access_token: process.env.JWT_SECRET || 'your_super_secret_key',
    jwt_refresh_token: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || 60 * 60 * 24 * 356,
    jwt_refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || 60 * 60 * 24 * 365,
    jwt_reset_token: process.env.JWT_RESET_TOKEN || process.env.JWT_SECRET,
    jwt_reset_expiresIn: process.env.JWT_RESET_EXPIRES_IN || 60 * 60 * 24 * 365,
    otp_expiry_minutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5') || 5,
    // Gmail App Password for sending emails
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_mail: process.env.SMTP_MAIL,
    smtp_password: process.env.SMTP_PASSWORD,
    smtp_service_name: process.env.SERVICE_NAME,
    // Stripe
    stripe_secret_key: process.env.STRIPE_SECRET_KEY || '',
    // S3 Configuration (lowercase)
    aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || '',
    aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || '',
    aws_region: process.env.AWS_REGION || "",
    aws_s3_bucket_name: process.env.AWS_S3_BUCKET_NAME || '',
    cloudfront_url: process.env.CLOUDFRONT_URL || '',
    google_maps_api_key: process.env.GOOGLE_MAP_API_KEY
};
export default configs;
//# sourceMappingURL=env.config.js.map
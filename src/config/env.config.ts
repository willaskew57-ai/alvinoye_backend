import { log } from 'console';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const configs = {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  database_url: process.env.DATABASE_URI || process.env.DATABASE_URI,

  bcrypt_salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12') || 12,

  // JWT configuration - using your provided JWT_SECRET
  jwt_access_token: process.env.JWT_SECRET || 'your_super_secret_key',
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || 60 * 60 * 24 * 356,
  jwt_refresh_expiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN || 60 * 60 * 24 * 365,
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

  // DPO Pay (DirectPay Online)
  dpo_company_token: process.env.DPO_COMPANY_TOKEN || '',
  dpo_api_url:
    process.env.DPO_API_URL || 'https://secure.3gdirectpay.com/API/v6/',
  dpo_payment_url:
    process.env.DPO_PAYMENT_URL || 'https://secure.3gdirectpay.com/payv3.php',
  dpo_currency: process.env.DPO_CURRENCY || 'NGN',
  dpo_service_type: process.env.DPO_SERVICE_TYPE || '54841',
  // ISO country code used for DPO fraud screening (NGN -> NG).
  dpo_country: process.env.DPO_COUNTRY || 'NG',
  // Public backend URL DPO redirects the customer back to after payment
  dpo_redirect_url: process.env.DPO_REDIRECT_URL || '',
  // Frontend URL the customer is finally sent to (success/cancel pages)
  client_url: process.env.CLIENT_URL || 'http://localhost:3000',

  // Twilio
  twilio_account_sid: process.env.TWILIO_ACCOUNT_SID || '',
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN || '',
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER || '',

  // S3 Configuration (lowercase)
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID || '',
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY || '',
  aws_region: process.env.AWS_REGION || '',
  aws_s3_bucket_name: process.env.AWS_S3_BUCKET_NAME || '',
  cloudfront_url: process.env.CLOUDFRONT_URL || '',
  google_maps_api_key: process.env.GOOGLE_MAP_API_KEY,
};
// log('Loaded configuration:', configs);
export default configs;

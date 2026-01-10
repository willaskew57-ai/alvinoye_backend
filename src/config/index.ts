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
  jwt_access_expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || 60 * 60 * 24 * 356, // 365 days
  jwt_refresh_expiresIn:
    process.env.JWT_REFRESH_EXPIRES_IN || 60 * 60 * 24 * 365, // 365 days
  jwt_reset_token: process.env.JWT_RESET_TOKEN || process.env.JWT_SECRET,
  jwt_reset_expiresIn: process.env.JWT_RESET_EXPIRES_IN || 60 * 60 * 24 * 365, // 365 minutes
};

export default configs;

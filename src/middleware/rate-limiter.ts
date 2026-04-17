import { rateLimit } from 'express-rate-limit';

// 1. General Limiter: Protects all API endpoints
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// 2. Strict Limiter: Specifically for OTP generation and verification
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
//   windowMs: 2 * 60 * 1000, // 2 minutes window for testing
  limit: 5, // Limit each IP to 5 requests per hour for sensitive routes
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: {
    status: 429,
    message: 'Too many login or OTP attempts. Please try again after an hour.',
  },
  skipSuccessfulRequests: false, // Count failed and successful attempts
});
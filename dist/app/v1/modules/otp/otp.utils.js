import crypto from 'crypto';
/**
 * Generates a random 6-digit numeric OTP
 */
export const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * Hashes a string using SHA256
 */
export const hashOtp = (otp) => {
    return crypto.createHash('sha256').update(otp).digest('hex');
};
//# sourceMappingURL=otp.utils.js.map
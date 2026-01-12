import httpStatus from 'http-status';
import { Otp } from './otp.model';
import { generateOtp, hashOtp } from './otp.utils';
import { Types } from 'mongoose';
import AppError from '../../../../../errors/app-error';
/**
 * Creates and stores an OTP for a user
 */
const generateAndSaveOtp = async (user_id, purpose) => {
    const rawOtp = generateOtp();
    const otpHash = hashOtp(rawOtp);
    // Set expiry to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // Remove any existing unused OTPs for this user/purpose before creating new one
    await Otp.deleteMany({ user: user_id, purpose, is_used: false });
    await Otp.create({
        user: user_id,
        otp_hash: otpHash,
        purpose,
        expires_at: expiresAt,
    });
    // Return the raw OTP so it can be sent via Email/SMS
    return rawOtp;
};
/**
 * Verifies the OTP provided by the user
 */
const verifyOtpFromDB = async (user_id, inputOtp, purpose) => {
    const inputHash = hashOtp(inputOtp);
    const otpRecord = await Otp.findOne({
        user: user_id,
        purpose,
        is_used: false,
        expires_at: { $gt: new Date() },
    });
    if (!otpRecord) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or not found');
    }
    // Check if max attempts (5) reached
    if (otpRecord.attempts >= 5) {
        throw new AppError(httpStatus.FORBIDDEN, 'Too many failed attempts');
    }
    if (otpRecord.otp_hash !== inputHash) {
        // Increment attempts on failure
        await Otp.findByIdAndUpdate(otpRecord._id, { $inc: { attempts: 1 } });
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
    }
    // Mark as used
    otpRecord.is_used = true;
    await otpRecord.save();
    return true;
};
export const OtpServices = {
    generateAndSaveOtp,
    verifyOtpFromDB,
};
//# sourceMappingURL=otp.services.js.map
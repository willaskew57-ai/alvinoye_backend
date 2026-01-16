import httpStatus from 'http-status';
import { Otp } from './otp.model';
import { generateOtp, hashOtp } from './otp.utils';
import { Types } from 'mongoose';
import AppError from '../../../../errors/app-error';
/**
 * Creates and stores an OTP
 */
const generateAndSaveOtp = async (payload) => {
    const { user_id, parcel_id, purpose } = payload;
    const rawOtp = generateOtp();
    const otpHash = hashOtp(rawOtp);
    const otpData = {
        otp_hash: otpHash,
        purpose,
    };
    // assign conditionally
    if (user_id)
        otpData.user = user_id;
    if (parcel_id)
        otpData.parcel = parcel_id;
    if (purpose !== 'PARCEL') {
        otpData.expires_at = new Date(Date.now() + 5 * 60 * 1000);
    }
    // delete previous unused OTPs
    await Otp.deleteMany({
        purpose,
        is_used: false,
        ...(user_id && { user: user_id }),
        ...(parcel_id && { parcel: parcel_id }),
    });
    await Otp.create(otpData);
    return rawOtp;
};
/**
 * Verifies OTP
 */
const verifyOtpFromDB = async (payload) => {
    const { user_id, parcel_id, inputOtp, purpose } = payload;
    const inputHash = hashOtp(inputOtp);
    const query = {
        purpose,
        is_used: false,
        ...(user_id && { user: user_id }),
        ...(parcel_id && { parcel: parcel_id }),
    };
    // expiry check only for non-parcel OTP
    if (purpose !== 'PARCEL') {
        query.expires_at = { $gt: new Date() };
    }
    const otpRecord = await Otp.findOne(query);
    if (!otpRecord) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired or not found');
    }
    // max attempts check
    if (otpRecord.attempts >= 5) {
        throw new AppError(httpStatus.FORBIDDEN, 'Too many failed attempts');
    }
    if (otpRecord.otp_hash !== inputHash) {
        await Otp.findByIdAndUpdate(otpRecord._id, {
            $inc: { attempts: 1 },
        });
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP');
    }
    // mark used
    otpRecord.is_used = true;
    await otpRecord.save();
    return true;
};
export const OtpServices = {
    generateAndSaveOtp,
    verifyOtpFromDB,
};
//# sourceMappingURL=otp.services.js.map
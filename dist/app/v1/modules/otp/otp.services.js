"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const otp_model_1 = require("./otp.model");
const otp_utils_1 = require("./otp.utils");
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const generateAndSaveOtp = async (payload) => {
    const { user_id, parcel_id, purpose } = payload;
    const rawOtp = (0, otp_utils_1.generateOtp)();
    const otpHash = (0, otp_utils_1.hashOtp)(rawOtp);
    const otpData = {
        otp_hash: otpHash,
        purpose,
    };
    if (user_id)
        otpData.user = user_id;
    if (parcel_id)
        otpData.parcel = parcel_id;
    if (purpose !== 'PARCEL') {
        otpData.expires_at = new Date(Date.now() + 5 * 60 * 1000);
    }
    await otp_model_1.Otp.deleteMany({
        purpose,
        is_used: false,
        ...(user_id && { user: user_id }),
        ...(parcel_id && { parcel: parcel_id }),
    });
    await otp_model_1.Otp.create(otpData);
    return rawOtp;
};
const verifyOtpFromDB = async (payload) => {
    const { user_id, parcel_id, inputOtp, purpose } = payload;
    const inputHash = (0, otp_utils_1.hashOtp)(inputOtp);
    const query = {
        purpose,
        is_used: false,
        ...(user_id && { user: user_id }),
        ...(parcel_id && { parcel: parcel_id }),
    };
    if (purpose !== 'PARCEL') {
        query.expires_at = { $gt: new Date() };
    }
    const otpRecord = await otp_model_1.Otp.findOne(query);
    if (!otpRecord) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'OTP not found or already used');
    }
    if (purpose !== 'PARCEL' && otpRecord.expires_at) {
        const currentTime = new Date();
        if (currentTime > otpRecord.expires_at) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'OTP has expired. Please request a new one.');
        }
    }
    if (otpRecord.attempts >= 5) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'Too many failed attempts');
    }
    if (otpRecord.otp_hash !== inputHash) {
        await otp_model_1.Otp.findByIdAndUpdate(otpRecord._id, {
            $inc: { attempts: 1 },
        });
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Invalid OTP');
    }
    otpRecord.is_used = true;
    await otpRecord.save();
    return true;
};
exports.OtpServices = {
    generateAndSaveOtp,
    verifyOtpFromDB,
};
//# sourceMappingURL=otp.services.js.map
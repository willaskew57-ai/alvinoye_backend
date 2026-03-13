"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHelpers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const send_email_1 = require("./send-email");
const mail_1 = require("../mail");
const parcel_otp_temp_1 = require("../mail/parcel-otp-temp");
// ** --- Helper Functions ---
const sendOtpResendEmail = async (email, data) => {
    try {
        await (0, send_email_1.sendEmail)({
            email,
            subject: 'New Activation Code',
            html: (0, mail_1.otpResendTemp)(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send OTP resend email');
    }
};
const sendRegisterEmail = async (email, data) => {
    try {
        await (0, send_email_1.sendEmail)({
            email,
            subject: 'Welcome to Parcel - Activate Your Account',
            html: (0, mail_1.registerEmailTemp)(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send sign-up email');
    }
};
const sendResetPasswordEmail = async (email, data) => {
    try {
        await (0, send_email_1.sendEmail)({
            email,
            subject: 'Password Reset Request',
            html: (0, mail_1.resetPassEmailTemp)(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send password reset email');
    }
};
const sendParcelOtpEmail = async (data) => {
    try {
        await (0, send_email_1.sendEmail)({
            email: data.email,
            subject: 'Parcel Pickup Verification Code',
            html: (0, parcel_otp_temp_1.parcelOtpEmailTemp)({
                name: data.name,
                verificationCode: data.verificationCode,
            }),
        });
    }
    catch (error) {
        console.error('Parcel OTP Email Error:', error);
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send parcel OTP email');
    }
};
exports.EmailHelpers = {
    sendOtpResendEmail,
    sendRegisterEmail,
    sendResetPasswordEmail,
    sendParcelOtpEmail
};
//# sourceMappingURL=email-helper.js.map
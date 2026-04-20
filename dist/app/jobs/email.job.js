"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmailJob = exports.sendResendOtpEmailJob = exports.sendRegisterEmailJob = void 0;
const email_helper_1 = require("../../utils/email-helper");
const sendRegisterEmailJob = async (email, data) => {
    try {
        await email_helper_1.EmailHelpers.sendRegisterEmail(email, {
            user: data.userName,
            activationCode: data.otp,
            activationCodeExpire: data.expiry,
        });
        console.log(`[email.job] Registration email sent successfully to ${email}`);
    }
    catch (error) {
        console.error(`[email.job] Failed to send registration email to ${email}:`, error);
        throw error;
    }
};
exports.sendRegisterEmailJob = sendRegisterEmailJob;
const sendResendOtpEmailJob = async (email, data) => {
    try {
        await email_helper_1.EmailHelpers.sendOtpResendEmail(email, {
            user: data.userName,
            code: data.otp,
            expiresIn: data.expiry,
        });
        console.log(`[email.job] Resend OTP email sent successfully to ${email}`);
    }
    catch (error) {
        console.error(`[email.job] Failed to send resend OTP email to ${email}:`, error);
        throw error;
    }
};
exports.sendResendOtpEmailJob = sendResendOtpEmailJob;
const sendResetPasswordEmailJob = async (email, data) => {
    try {
        await email_helper_1.EmailHelpers.sendResetPasswordEmail(email, {
            name: data.userName,
            verificationCode: data.otp,
            verificationCodeExpire: data.expiry,
        });
        console.log(`[email.job] Reset password email sent successfully to ${email}`);
    }
    catch (error) {
        console.error(`[email.job] Failed to send reset password email to ${email}:`, error);
        throw error;
    }
};
exports.sendResetPasswordEmailJob = sendResetPasswordEmailJob;
//# sourceMappingURL=email.job.js.map
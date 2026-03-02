import httpStatus from 'http-status';
import AppError from '../errors/app-error';
import { sendEmail } from './send-email';
import { otpResendTemp, resetPassEmailTemp, registerEmailTemp } from '../mail';
import { parcelOtpEmailTemp } from '../mail/parcel-otp-temp';
// ** --- Helper Functions ---
const sendOtpResendEmail = async (email, data) => {
    try {
        await sendEmail({
            email,
            subject: 'New Activation Code',
            html: otpResendTemp(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send OTP resend email');
    }
};
const sendRegisterEmail = async (email, data) => {
    try {
        await sendEmail({
            email,
            subject: 'Welcome to Parcel - Activate Your Account',
            html: registerEmailTemp(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send sign-up email');
    }
};
const sendResetPasswordEmail = async (email, data) => {
    try {
        await sendEmail({
            email,
            subject: 'Password Reset Request',
            html: resetPassEmailTemp(data),
        });
    }
    catch (error) {
        console.error('Email Error:', error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send password reset email');
    }
};
const sendParcelOtpEmail = async (data) => {
    try {
        await sendEmail({
            email: data.email,
            subject: 'Parcel Pickup Verification Code',
            html: parcelOtpEmailTemp({
                name: data.name,
                verificationCode: data.verificationCode,
            }),
        });
    }
    catch (error) {
        console.error('Parcel OTP Email Error:', error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send parcel OTP email');
    }
};
export const EmailHelpers = {
    sendOtpResendEmail,
    sendRegisterEmail,
    sendResetPasswordEmail,
    sendParcelOtpEmail
};
//# sourceMappingURL=email-helper.js.map
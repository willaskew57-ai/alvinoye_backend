import httpStatus from 'http-status';
import AppError from '../errors/app-error';
import { sendEmail } from './send-email';
import { otpResendTemp, resetPassEmailTemp, registerEmailTemp } from '../mail';
import { parcelOtpEmailTemp } from '../mail/parcel-otp-temp';

// --- Interfaces for the Helpers ---
interface IOTPData {
  user: string;
  code?: string;
  activationCode?: string;
  expiresIn?: string | number;
  activationCodeExpire?: string | number;
}

interface ISignUpData {
  user: string;
  activationCode: string;
  activationCodeExpire: string | number;
}

interface IResetPassData {
  name: string;
  verificationCode: string;
  verificationCodeExpire: string | number;
}

interface IParcelOtpEmailData {
  email: string;
  name: string;
  verificationCode: string;
}

// ** --- Helper Functions ---

/**
 * Sends a resend-OTP email
 */
const sendOtpResendEmail = async (
  email: string,
  data: IOTPData
): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject: 'New Activation Code',
      html: otpResendTemp(data),
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send OTP resend email'
    );
  }
};

/**
 * Sends a welcome/activation email after sign up
 */
const sendRegisterEmail = async (
  email: string,
  data: ISignUpData
): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject: 'Welcome to Parcel - Activate Your Account',
      html: registerEmailTemp(data),
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send sign-up email'
    );
  }
};

/**
 * Sends a password reset verification code email
 */
const sendResetPasswordEmail = async (
  email: string,
  data: IResetPassData
): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject: 'Password Reset Request',
      html: resetPassEmailTemp(data),
    });
  } catch (error) {
    console.error('Email Error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send password reset email'
    );
  }
};

const sendParcelOtpEmail = async (data: IParcelOtpEmailData): Promise<void> => {
  try {
    await sendEmail({
      email: data.email,
      subject: 'Parcel Pickup Verification Code',
      html: parcelOtpEmailTemp({
        name: data.name,
        verificationCode: data.verificationCode,
      }),
    });
  } catch (error) {
    console.error('Parcel OTP Email Error:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send parcel OTP email'
    );
  }
};

export const EmailHelpers = {
  sendOtpResendEmail,
  sendRegisterEmail,
  sendResetPasswordEmail,
  sendParcelOtpEmail
};

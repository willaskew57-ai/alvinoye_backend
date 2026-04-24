import { EmailHelpers } from '../../utils/email-helper';

export interface RegisterEmailPayload {
  email: string;
  userName: string;
  otp: string;
  expiry: number;
}

export interface ResendOtpEmailPayload {
  email: string;
  userName: string;
  otp: string;
  expiry: number;
}

export interface ResetPasswordEmailPayload {
  email: string;
  userName: string;
  otp: string;
  expiry: number;
}

export interface ParcelOtpEmailPayload {
  email: string;
  name: string;
  verificationCode: string;
}

export const sendRegisterEmailJob = async (
  email: string,
  data: RegisterEmailPayload
): Promise<void> => {
  try {
    await EmailHelpers.sendRegisterEmail(email, {
      user: data.userName,
      activationCode: data.otp,
      activationCodeExpire: data.expiry,
    });
    console.log(`[email.job] Registration email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[email.job] Failed to send registration email to ${email}:`, error);
    throw error;
  }
};

export const sendResendOtpEmailJob = async (
  email: string,
  data: ResendOtpEmailPayload
): Promise<void> => {
  try {
    await EmailHelpers.sendOtpResendEmail(email, {
      user: data.userName,
      code: data.otp,
      expiresIn: data.expiry,
    });
    console.log(`[email.job] Resend OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[email.job] Failed to send resend OTP email to ${email}:`, error);
    throw error;
  }
};

export const sendResetPasswordEmailJob = async (
  email: string,
  data: ResetPasswordEmailPayload
): Promise<void> => {
  try {
    await EmailHelpers.sendResetPasswordEmail(email, {
      name: data.userName,
      verificationCode: data.otp,
      verificationCodeExpire: data.expiry,
    });
    console.log(`[email.job] Reset password email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[email.job] Failed to send reset password email to ${email}:`, error);
    throw error;
  }
};

export const sendParcelOtpEmailJob = async (
  email: string,
  data: ParcelOtpEmailPayload
): Promise<void> => {
  try {
    await EmailHelpers.sendParcelOtpEmail({
      email: data.email,
      name: data.name,
      verificationCode: data.verificationCode,
    });
    console.log(`[email.job] Parcel OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error(`[email.job] Failed to send parcel OTP email to ${email}:`, error);
    throw error;
  }
};
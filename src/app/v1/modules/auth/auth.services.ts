import httpStatus from 'http-status';
import type { JwtPayload } from 'jsonwebtoken';
import configs from '../../../../config/env.config';
import AppError from '../../../../errors/app-error';
import { createToken, verifyToken } from './auth.utils';
import type { IChangePassword, ILoginUser } from './auth.interface';
import User from '../user/user.model';
import type { TUser } from '../user/user.interface';
import { OtpServices } from '../otp/otp.services';
import type { Types } from 'mongoose';
import { EmailHelpers } from '../../../../utils/email-helper';
import { emailQueue, pushEmailJob } from '../../../queues/email.queue';
import {
  sendRegisterEmailJob,
  sendResendOtpEmailJob,
  sendResetPasswordEmailJob,
  type RegisterEmailPayload,
  type ResendOtpEmailPayload,
  type ResetPasswordEmailPayload,
} from '../../../jobs/email.job';

// ** ------- Register User Service -------
const registerUser = async (payload: TUser) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);
  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'User with this email already exists!'
    );
  }

  const isProfileCompleted = payload.role !== 'DRIVER';
  const status = payload.role === 'DRIVER' ? 'PENDING' : 'ACTIVE';

  const userData = {
    ...payload,
    is_profile_completed: isProfileCompleted,
    status,
    is_verified: false,
    request_date: new Date(),
  };

  const newUser = await User.create(userData);

  if (!newUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to register user');
  }

  const otp = await OtpServices.generateAndSaveOtp({
    user_id: newUser._id as Types.ObjectId,
    purpose: 'REGISTER',
  });
  console.log(otp, 'register Otp');

  // Push registration email to background queue
  const emailPayload: RegisterEmailPayload = {
    email: newUser.email,
    userName: newUser.full_name || 'User',
    otp,
    expiry: configs.otp_expiry_minutes || 5,
  };

  await pushEmailJob(
    () => sendRegisterEmailJob(emailPayload.email, emailPayload),
    emailPayload.email
  );

  const jwtPayload = {
    user_id: newUser._id.toString(),
    role: newUser.role,
  };

  const accessToken = createToken(
    jwtPayload,
    configs.jwt_access_token as string,
    configs.jwt_access_expiresIn as number
  );

  const refreshToken = createToken(
    jwtPayload,
    configs.jwt_refresh_token as string,
    configs.jwt_access_expiresIn as number
  );

  return {
    user: newUser,
    accessToken,
    refreshToken,
    // otp,
  };
};

// ** -------- Login Service ---------

const loginServices = async (payload: ILoginUser) => {
  // Use the static method from User model
  const user = await User.isUserExistsByEmail(payload.email);

  console.log(user, 'user');

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User does not exist with these credentials!'
    );
  }

  if (await User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted!');
  }

  if (await User.isUserBlocked(user)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This account is currently blocked!'
    );
  }

  const isVerified = await User.isUserVerified(user);
  if (!isVerified) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your email is not verified. Please verify your OTP first.'
    );
  }

  // const isActive = await User.isUserActive(user);
  // if (!isActive) {
  //   throw new AppError(
  //     httpStatus.FORBIDDEN,
  //     'Your account is currently under review. Please wait for approval.'
  //   );
  // }

  // Compare Password
  const isPasswordMatched = await User.compareUserPassword(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials!');
  }

  const userData = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    status: user.status,
    is_profile_completed: user.is_profile_completed,
  };

  // JWT Payload including the role
  const jwtPayload = {
    user_id: (user._id as any).toString(),
    role: user.role, // Added role
  };

  const accessToken = createToken(
    jwtPayload,
    configs.jwt_access_token as string,
    configs.jwt_access_expiresIn as number
  );

  const refreshToken = createToken(
    jwtPayload,
    configs.jwt_refresh_token as string,
    configs.jwt_access_expiresIn as number
  );

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};

/**
 * Change Password Service
 */
const changePasswordIntoDB = async (
  userData: JwtPayload,
  payload: IChangePassword
) => {
  const { old_password, new_password } = payload;

  const user = await User.findById(userData.user_id).select('+password');

  if (
    !user ||
    (await User.isUserDeleted(user)) ||
    (await User.isUserBlocked(user))
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found or inaccessible!');
  }

  const isPasswordMatched = await User.compareUserPassword(
    old_password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'The old password you entered is incorrect!'
    );
  }

  // Note: Password hashing is handled by the UserSchema.pre('save') middleware
  // So we just update the document and save it.
  user.password = new_password;
  await user.save();

  return null;
};

/**
 * Verify OTP Service
 */
const verifyOtp = async (
  payload: {
    otp: string;
    purpose: 'REGISTER' | 'RESET_PASSWORD';
  },
  token: string
) => {
  const { otp, purpose } = payload;

  const secretKey =
    purpose === 'REGISTER'
      ? (configs.jwt_access_token as string)
      : (configs.jwt_reset_token as string);

  const decoded = verifyToken(token, secretKey) as JwtPayload;

  await OtpServices.verifyOtpFromDB({
    user_id: decoded.user_id,
    inputOtp: otp,
    purpose,
  });

  if (purpose === 'REGISTER') {
    await User.findByIdAndUpdate(decoded.user_id, { is_verified: true });
  }

  return null;
};

/**
 * Resend OTP Service
 */
const resendOtp = async (payload: {
  email: string;
  purpose: 'REGISTER' | 'RESET_PASSWORD';
}) => {
  const { email, purpose } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found with this email!');
  }

  const otp = await OtpServices.generateAndSaveOtp({
    user_id: user._id as Types.ObjectId,
    purpose,
  });

  console.log(otp);

  // Push resend OTP email to background queue
  const emailPayload: ResendOtpEmailPayload = {
    email,
    userName: user.full_name || 'User',
    otp,
    expiry: configs.otp_expiry_minutes || 5,
  };

  await pushEmailJob(
    () => sendResendOtpEmailJob(emailPayload.email, emailPayload),
    emailPayload.email
  );

  return null;
};

/**
 * Refresh Token Service
 */
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, configs.jwt_refresh_token as string);
  const { user_id, iat } = decoded;

  const user = await User.findById(user_id);
  if (
    !user ||
    (await User.isUserDeleted(user)) ||
    (await User.isUserBlocked(user))
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Authentication failed. User is no longer active!'
    );
  }

  // Security: Check if password was changed after this refresh token was issued
  if (
    user.password_changed_at &&
    User.isJWTIssuedBeforePasswordChanged(
      user.password_changed_at,
      iat as number
    )
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Password recently changed. Please login again.'
    );
  }

  const jwtPayload = {
    user_id: (user._id as any).toString(),
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    configs.jwt_access_token as string,
    configs.jwt_access_expiresIn as number
  );

  return {
    accessToken,
  };
};

/**
 * Forget Password Service (Trigger)
 */
const forgetPassword = async (email: string) => {
  // 1. Check if user exists
  const user = await User.isUserExistsByEmail(email);

  if (
    !user ||
    (await User.isUserDeleted(user)) ||
    (await User.isUserBlocked(user))
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'No active account found with this email!'
    );
  }

  const user_id = user._id!;

  const otp = await OtpServices.generateAndSaveOtp({
    user_id: user_id as Types.ObjectId,
    purpose: 'RESET_PASSWORD',
  });

  console.log(otp);

  // Push reset password email to background queue
  const emailPayload: ResetPasswordEmailPayload = {
    email,
    userName: user.full_name || 'User',
    otp,
    expiry: configs.otp_expiry_minutes || 5,
  };

  await pushEmailJob(
    () => sendResetPasswordEmailJob(emailPayload.email, emailPayload),
    emailPayload.email
  );

  const jwtPayload = {
    user_id: user_id.toString(),
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    configs.jwt_reset_token as string,
    configs.jwt_reset_expiresIn as number
  );

  return {
    resetToken,
    user_id: user._id,
  };
};

/**
 * Reset Password Service (Final Step)
 */
const resetPassword = async (
  payload: { new_password: string },
  token: string
) => {
  const decoded = verifyToken(
    token,
    configs.jwt_reset_token as string
  ) as JwtPayload;

  const user = await User.findById(decoded.user_id);

  if (
    !user ||
    (await User.isUserDeleted(user)) ||
    (await User.isUserBlocked(user))
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Account is no longer active!');
  }

  // 4. Update password (pre-save middleware handles hashing)
  user.password = payload.new_password;

  // Important: Mark that password was changed to invalidate old tokens
  user.password_changed_at = new Date();

  await user.save();

  return null;
};

export const AuthServices = {
  registerUser,
  loginServices,
  verifyOtp,
  resendOtp,
  changePasswordIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};

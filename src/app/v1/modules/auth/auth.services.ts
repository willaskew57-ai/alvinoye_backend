import httpStatus from 'http-status';
import type { JwtPayload } from 'jsonwebtoken';
import configs from '../../../../config';
import AppError from '../../../../errors/app-error';
import { createToken, verifyToken } from './auth.utils';
import type { IChangePassword, ILoginUser } from './auth.interface';
import User from '../user/user.model';
import type { TUser } from '../user/user.interface';
import { OtpServices } from './otp/otp.services';
import type { Types } from 'mongoose';

// ** ------- Register User Service -------
const registerUser = async (payload: TUser) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);
  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'User with this email already exists!'
    );
  }

  const isProfileCompleted = payload.role !== 'CUSTOMER';

  const userData = {
    ...payload,
    is_profile_completed: isProfileCompleted,
    is_verified: false,
    request_date: new Date(),
  };

  console.log('Registering User:', userData);

  const newUser = await User.create(userData);

  if (!newUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to register user');
  }

  const otp = await OtpServices.generateAndSaveOtp(
    newUser._id as Types.ObjectId,
    'REGISTER'
  );

  const jwtPayload = {
    userId: newUser._id.toString(),
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
    otp,
  };
};

// ** -------- Login Service ---------

const loginServices = async (payload: ILoginUser) => {
  // Use the static method from User model
  const user = await User.isUserExistsByEmail(payload.email);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User does not exist with these credentials!'
    );
  }
  if (await User.isUserDeleted(user)) {
    throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted!');
  }

  // Check if user is blocked
  if (await User.isUserBlocked(user)) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This account is currently blocked!'
    );
  }

  // Compare Password
  const isPasswordMatched = await User.compareUserPassword(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials!');
  }

  console.log('User logged in:', user);

  // JWT Payload including the role
  const jwtPayload = {
    userId: (user._id as any).toString(),
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

  const user = await User.findById(userData.userId).select('+password');

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
const verifyOtp = async (payload: {
  user_id: string;
  otp: string;
  purpose: 'REGISTER' | 'RESET_PASSWORD';
}) => {
  const { user_id, otp, purpose } = payload;

  // 1. Verify OTP using OtpServices
  await OtpServices.verifyOtpFromDB(user_id, otp, purpose);

  // 2. If purpose is REGISTER, set user as verified
  if (purpose === 'REGISTER') {
    await User.findByIdAndUpdate(user_id, { is_verified: true });
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

  // 1. Find User
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found with this email!');
  }

  // 2. Generate and Save new OTP
  const otp = await OtpServices.generateAndSaveOtp(
    user._id as Types.ObjectId,
    purpose
  );

  return { otp };
};

/**
 * Refresh Token Service
 */
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, configs.jwt_refresh_token as string);
  const { userId, iat } = decoded;

  const user = await User.findById(userId);
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
    userId: (user._id as any).toString(),
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

  const userId = user._id!;

  // 2. Generate and Store OTP for RESET_PASSWORD purpose
  const otp = await OtpServices.generateAndSaveOtp(
    user._id as Types.ObjectId,
    'RESET_PASSWORD'
  );

  // 3. Generate a Reset Token (used for the final reset step)
  const jwtPayload = {
    userId: userId.toString(),
    role: user.role,
  };

  console.log('JWT reset expireIn', configs.jwt_reset_expiresIn);

  const resetToken = createToken(
    jwtPayload,
    configs.jwt_reset_token as string,
    configs.jwt_reset_expiresIn as number
  );

  console.log('Generated Reset Token:', resetToken);

  return {
    resetToken,
    otp,
    userId: user._id,
  };
};

/**
 * Reset Password Service (Final Step)
 */
const resetPassword = async (
  payload: { id: string; new_password: string },
  token: string
) => {
  // 1. Verify the Reset Token
  const decoded = verifyToken(
    token,
    configs.jwt_reset_token as string
  ) as JwtPayload;

  // 2. Security Check: Ensure token matches the user being updated
  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid reset request!');
  }

  // 3. Check User Status
  const user = await User.findById(payload.id);

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

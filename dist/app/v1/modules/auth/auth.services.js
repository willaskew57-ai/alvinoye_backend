import httpStatus from 'http-status';
import configs from '../../../../config';
import AppError from '../../../../errors/app-error';
import { createToken, verifyToken } from './auth.utils';
import User from '../user/user.model';
import { OtpServices } from './otp/otp.services';
import { EmailHelpers } from '../../../../utils/email-helper';
// ** ------- Register User Service -------
const registerUser = async (payload) => {
    const isUserExists = await User.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, 'User with this email already exists!');
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
    const otp = await OtpServices.generateAndSaveOtp(newUser._id, 'REGISTER');
    // Send registration email
    await EmailHelpers.sendRegisterEmail(newUser.email, {
        user: newUser.full_name || 'User',
        activationCode: otp,
        activationCodeExpire: configs.otp_expiry_minutes || 5,
    });
    const jwtPayload = {
        user_id: newUser._id.toString(),
        role: newUser.role,
    };
    const accessToken = createToken(jwtPayload, configs.jwt_access_token, configs.jwt_access_expiresIn);
    const refreshToken = createToken(jwtPayload, configs.jwt_refresh_token, configs.jwt_access_expiresIn);
    return {
        user: newUser,
        accessToken,
        refreshToken,
        // otp,
    };
};
// ** -------- Login Service ---------
const loginServices = async (payload) => {
    // Use the static method from User model
    const user = await User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User does not exist with these credentials!');
    }
    if (await User.isUserDeleted(user)) {
        throw new AppError(httpStatus.FORBIDDEN, 'This account has been deleted!');
    }
    if (await User.isUserBlocked(user)) {
        throw new AppError(httpStatus.FORBIDDEN, 'This account is currently blocked!');
    }
    const isVerified = await User.isUserVerified(user);
    if (!isVerified) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Your email is not verified. Please verify your OTP first.');
    }
    const isActive = await User.isUserActive(user);
    if (!isActive) {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account is not active. Please contact support or wait for approval.');
    }
    // Compare Password
    const isPasswordMatched = await User.compareUserPassword(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Invalid credentials!');
    }
    const userData = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
    };
    // JWT Payload including the role
    const jwtPayload = {
        user_id: user._id.toString(),
        role: user.role, // Added role
    };
    const accessToken = createToken(jwtPayload, configs.jwt_access_token, configs.jwt_access_expiresIn);
    const refreshToken = createToken(jwtPayload, configs.jwt_refresh_token, configs.jwt_access_expiresIn);
    return {
        accessToken,
        refreshToken,
        user: userData,
    };
};
/**
 * Change Password Service
 */
const changePasswordIntoDB = async (userData, payload) => {
    const { old_password, new_password } = payload;
    const user = await User.findById(userData.user_id).select('+password');
    if (!user ||
        (await User.isUserDeleted(user)) ||
        (await User.isUserBlocked(user))) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found or inaccessible!');
    }
    const isPasswordMatched = await User.compareUserPassword(old_password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'The old password you entered is incorrect!');
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
const verifyOtp = async (payload) => {
    const { user_id, otp, purpose } = payload;
    await OtpServices.verifyOtpFromDB(user_id, otp, purpose);
    if (purpose === 'REGISTER') {
        await User.findByIdAndUpdate(user_id, { is_verified: true });
    }
    return null;
};
/**
 * Resend OTP Service
 */
const resendOtp = async (payload) => {
    const { email, purpose } = payload;
    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found with this email!');
    }
    // 2. Generate and Save new OTP
    const otp = await OtpServices.generateAndSaveOtp(user._id, purpose);
    // Send resend OTP email
    await EmailHelpers.sendOtpResendEmail(email, {
        user: user.full_name || 'User',
        code: otp,
        expiresIn: configs.otp_expiry_minutes || 5,
    });
    return null;
};
/**
 * Refresh Token Service
 */
const refreshToken = async (token) => {
    const decoded = verifyToken(token, configs.jwt_refresh_token);
    const { user_id, iat } = decoded;
    const user = await User.findById(user_id);
    if (!user ||
        (await User.isUserDeleted(user)) ||
        (await User.isUserBlocked(user))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Authentication failed. User is no longer active!');
    }
    // Security: Check if password was changed after this refresh token was issued
    if (user.password_changed_at &&
        User.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Password recently changed. Please login again.');
    }
    const jwtPayload = {
        user_id: user._id.toString(),
        role: user.role,
    };
    const accessToken = createToken(jwtPayload, configs.jwt_access_token, configs.jwt_access_expiresIn);
    return {
        accessToken,
    };
};
/**
 * Forget Password Service (Trigger)
 */
const forgetPassword = async (email) => {
    // 1. Check if user exists
    const user = await User.isUserExistsByEmail(email);
    if (!user ||
        (await User.isUserDeleted(user)) ||
        (await User.isUserBlocked(user))) {
        throw new AppError(httpStatus.NOT_FOUND, 'No active account found with this email!');
    }
    const user_id = user._id;
    const otp = await OtpServices.generateAndSaveOtp(user_id, 'RESET_PASSWORD');
    // Send reset password email
    await EmailHelpers.sendResetPasswordEmail(email, {
        name: user.full_name || 'User',
        verificationCode: otp,
        verificationCodeExpire: configs.otp_expiry_minutes || 5,
    });
    const jwtPayload = {
        user_id: user_id.toString(),
        role: user.role,
    };
    const resetToken = createToken(jwtPayload, configs.jwt_reset_token, configs.jwt_reset_expiresIn);
    return {
        resetToken,
        otp,
        user_id: user._id,
    };
};
/**
 * Reset Password Service (Final Step)
 */
const resetPassword = async (payload, token) => {
    const decoded = verifyToken(token, configs.jwt_reset_token);
    if (payload.id !== decoded.user_id) {
        throw new AppError(httpStatus.FORBIDDEN, 'Invalid reset request!');
    }
    const user = await User.findById(payload.id);
    if (!user ||
        (await User.isUserDeleted(user)) ||
        (await User.isUserBlocked(user))) {
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
//# sourceMappingURL=auth.services.js.map
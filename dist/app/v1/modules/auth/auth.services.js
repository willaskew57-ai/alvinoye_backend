"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const auth_utils_1 = require("./auth.utils");
const user_model_1 = __importDefault(require("../user/user.model"));
const otp_services_1 = require("../otp/otp.services");
const email_queue_1 = require("../../../queues/email.queue");
const email_job_1 = require("../../../jobs/email.job");
// ** ------- Register User Service -------
const registerUser = async (payload) => {
    const isUserExists = await user_model_1.default.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, 'User with this email already exists!');
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
    const newUser = await user_model_1.default.create(userData);
    if (!newUser) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Failed to register user');
    }
    const otp = await otp_services_1.OtpServices.generateAndSaveOtp({
        user_id: newUser._id,
        purpose: 'REGISTER',
    });
    console.log(otp, 'register Otp');
    // Push registration email to background queue
    const emailPayload = {
        email: newUser.email,
        userName: newUser.full_name || 'User',
        otp,
        expiry: env_config_1.default.otp_expiry_minutes || 5,
    };
    await (0, email_queue_1.pushEmailJob)(() => (0, email_job_1.sendRegisterEmailJob)(emailPayload.email, emailPayload), emailPayload.email);
    const jwtPayload = {
        user_id: newUser._id.toString(),
        role: newUser.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_access_token, env_config_1.default.jwt_access_expiresIn);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_refresh_token, env_config_1.default.jwt_access_expiresIn);
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
    const user = await user_model_1.default.isUserExistsByEmail(payload.email);
    console.log(user, 'user');
    if (!user) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User does not exist with these credentials!');
    }
    if (await user_model_1.default.isUserDeleted(user)) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'This account has been deleted!');
    }
    if (await user_model_1.default.isUserBlocked(user)) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'This account is currently blocked!');
    }
    // const isVerified = await User.isUserVerified(user);
    // if (!isVerified) {
    //   throw new AppError(
    //     httpStatus.UNAUTHORIZED,
    //     'Your email is not verified. Please verify your OTP first.'
    //   );
    // }
    // const isActive = await User.isUserActive(user);
    // if (!isActive) {
    //   throw new AppError(
    //     httpStatus.FORBIDDEN,
    //     'Your account is currently under review. Please wait for approval.'
    //   );
    // }
    // Compare Password
    const isPasswordMatched = await user_model_1.default.compareUserPassword(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'Invalid credentials!');
    }
    const userData = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        status: user.status,
        is_verified: user.is_verified,
        is_profile_completed: user.is_profile_completed,
    };
    // JWT Payload including the role
    const jwtPayload = {
        user_id: user._id.toString(),
        role: user.role, // Added role
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_access_token, env_config_1.default.jwt_access_expiresIn);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_refresh_token, env_config_1.default.jwt_access_expiresIn);
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
    const user = await user_model_1.default.findById(userData.user_id).select('+password');
    if (!user ||
        (await user_model_1.default.isUserDeleted(user)) ||
        (await user_model_1.default.isUserBlocked(user))) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found or inaccessible!');
    }
    const isPasswordMatched = await user_model_1.default.compareUserPassword(old_password, user.password);
    if (!isPasswordMatched) {
        throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'The old password you entered is incorrect!');
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
const verifyOtp = async (payload, token) => {
    const { otp, purpose } = payload;
    const secretKey = purpose === 'REGISTER'
        ? env_config_1.default.jwt_access_token
        : env_config_1.default.jwt_reset_token;
    const decoded = (0, auth_utils_1.verifyToken)(token, secretKey);
    await otp_services_1.OtpServices.verifyOtpFromDB({
        user_id: decoded.user_id,
        inputOtp: otp,
        purpose,
    });
    if (purpose === 'REGISTER') {
        const user = await user_model_1.default.findByIdAndUpdate(decoded.user_id, {
            is_verified: true,
        });
        return user;
    }
    return null;
};
/**
 * Resend OTP Service
 */
const resendOtp = async (payload) => {
    const { email, purpose } = payload;
    const user = await user_model_1.default.findOne({ email });
    if (!user) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found with this email!');
    }
    const otp = await otp_services_1.OtpServices.generateAndSaveOtp({
        user_id: user._id,
        purpose,
    });
    console.log(otp);
    // Push resend OTP email to background queue
    const emailPayload = {
        email,
        userName: user.full_name || 'User',
        otp,
        expiry: env_config_1.default.otp_expiry_minutes || 5,
    };
    await (0, email_queue_1.pushEmailJob)(() => (0, email_job_1.sendResendOtpEmailJob)(emailPayload.email, emailPayload), emailPayload.email);
    return null;
};
/**
 * Refresh Token Service
 */
const refreshToken = async (token) => {
    const decoded = (0, auth_utils_1.verifyToken)(token, env_config_1.default.jwt_refresh_token);
    const { user_id, iat } = decoded;
    const user = await user_model_1.default.findById(user_id);
    if (!user ||
        (await user_model_1.default.isUserDeleted(user)) ||
        (await user_model_1.default.isUserBlocked(user))) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'Authentication failed. User is no longer active!');
    }
    // Security: Check if password was changed after this refresh token was issued
    if (user.password_changed_at &&
        user_model_1.default.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
        throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'Password recently changed. Please login again.');
    }
    const jwtPayload = {
        user_id: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_access_token, env_config_1.default.jwt_access_expiresIn);
    return {
        accessToken,
    };
};
/**
 * Forget Password Service (Trigger)
 */
const forgetPassword = async (email) => {
    // 1. Check if user exists
    const user = await user_model_1.default.isUserExistsByEmail(email);
    if (!user ||
        (await user_model_1.default.isUserDeleted(user)) ||
        (await user_model_1.default.isUserBlocked(user))) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'No active account found with this email!');
    }
    const user_id = user._id;
    const otp = await otp_services_1.OtpServices.generateAndSaveOtp({
        user_id: user_id,
        purpose: 'RESET_PASSWORD',
    });
    console.log(otp);
    // Push reset password email to background queue
    const emailPayload = {
        email,
        userName: user.full_name || 'User',
        otp,
        expiry: env_config_1.default.otp_expiry_minutes || 5,
    };
    await (0, email_queue_1.pushEmailJob)(() => (0, email_job_1.sendResetPasswordEmailJob)(emailPayload.email, emailPayload), emailPayload.email);
    const jwtPayload = {
        user_id: user_id.toString(),
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, env_config_1.default.jwt_reset_token, env_config_1.default.jwt_reset_expiresIn);
    return {
        resetToken,
        user_id: user._id,
    };
};
/**
 * Reset Password Service (Final Step)
 */
const resetPassword = async (payload, token) => {
    const decoded = (0, auth_utils_1.verifyToken)(token, env_config_1.default.jwt_reset_token);
    const user = await user_model_1.default.findById(decoded.user_id);
    if (!user ||
        (await user_model_1.default.isUserDeleted(user)) ||
        (await user_model_1.default.isUserBlocked(user))) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Account is no longer active!');
    }
    // 4. Update password (pre-save middleware handles hashing)
    user.password = payload.new_password;
    // Important: Mark that password was changed to invalidate old tokens
    user.password_changed_at = new Date();
    await user.save();
    return null;
};
exports.AuthServices = {
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
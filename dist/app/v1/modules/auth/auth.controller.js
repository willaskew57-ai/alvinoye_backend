"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const auth_services_1 = require("./auth.services");
// ** Register user controller:
const register = (0, catch_async_1.default)(async (req, res) => {
    const result = await auth_services_1.AuthServices.registerUser(req.body);
    const { accessToken, refreshToken, user } = result;
    // set refresh token to cookie (Same as login flow)
    res.cookie('refresh_token', refreshToken, {
        secure: env_config_1.default.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User registered successfully!',
        data: {
            user,
            accessToken,
        },
    });
});
// login user:
const login = (0, catch_async_1.default)(async (req, res) => {
    const result = await auth_services_1.AuthServices.loginServices(req.body);
    const { accessToken, refreshToken, user } = result;
    // set refresh token to cookie:
    res.cookie('refresh_token', refreshToken, {
        secure: env_config_1.default.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // ✅ 7 days
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'LoggedIn Successfully!!!',
        data: {
            accessToken,
            refreshToken,
            user,
        },
    });
});
const logout = (0, catch_async_1.default)(async (req, res) => {
    res.cookie('refresh_token', '', {
        httpOnly: true,
        secure: env_config_1.default.node_env === 'production',
        sameSite: 'none',
        expires: new Date(0),
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged out successfully!',
        data: null,
    });
});
const verifyOtp = (0, catch_async_1.default)(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    await auth_services_1.AuthServices.verifyOtp(req.body, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP Verified Successfully!',
        data: null,
    });
});
const resendOtp = (0, catch_async_1.default)(async (req, res) => {
    const result = await auth_services_1.AuthServices.resendOtp(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New OTP sent successfully!',
        data: result,
    });
});
// change password controller:
const changePassword = (0, catch_async_1.default)(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await auth_services_1.AuthServices.changePasswordIntoDB(user, payload);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Updated Successfully!!!',
        data: result,
    });
});
// refresh-token controller:
const getRefreshToken = (0, catch_async_1.default)(async (req, res) => {
    const { refresh_token } = req.cookies;
    const result = await auth_services_1.AuthServices.refreshToken(refresh_token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access Token is Retrieved Successfully!!!',
        data: result,
    });
});
// forget password controller:
const forgetPassword = (0, catch_async_1.default)(async (req, res) => {
    const email = req.body.email;
    const result = await auth_services_1.AuthServices.forgetPassword(email);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent to your email. Please verify to reset your password.',
        data: result,
    });
});
// reset password controller :
const resetPassword = (0, catch_async_1.default)(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await auth_services_1.AuthServices.resetPassword(req.body, token);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Reset Successfully!!!',
        data: result,
    });
});
exports.AuthControllers = {
    register,
    login,
    logout,
    verifyOtp,
    resendOtp,
    changePassword,
    getRefreshToken,
    forgetPassword,
    resetPassword,
};
//# sourceMappingURL=auth.controller.js.map
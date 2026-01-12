import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catchAsync';
import configs from '../../../../config';
import sendResponse from '../../../../utils/sendResponse';
import { AuthServices } from './auth.services';
// ** Register user controller:
const register = catchAsync(async (req, res) => {
    const result = await AuthServices.registerUser(req.body);
    const { accessToken, refreshToken, user, otp } = result;
    // set refresh token to cookie (Same as login flow)
    res.cookie('refresh_token', refreshToken, {
        secure: configs.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered successfully!',
        data: {
            user,
            accessToken,
            otp,
        },
    });
});
// login user:
const login = catchAsync(async (req, res) => {
    const result = await AuthServices.loginServices(req.body);
    const { accessToken, refreshToken } = result;
    // set refresh token to cookie:
    res.cookie('refresh_token', refreshToken, {
        secure: configs.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 365 * 24 * 60 * 60 * 1000, // convert 365 days to milliseconds:
    });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'LoggedIn Successfully!!!',
        data: {
            accessToken,
        },
    });
});
const verifyOtp = catchAsync(async (req, res) => {
    await AuthServices.verifyOtp(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OTP Verified Successfully!',
        data: null,
    });
});
const resendOtp = catchAsync(async (req, res) => {
    const result = await AuthServices.resendOtp(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New OTP sent successfully!',
        data: result,
    });
});
// change password controller:
const changePassword = catchAsync(async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const result = await AuthServices.changePasswordIntoDB(user, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Updated Successfully!!!',
        data: result,
    });
});
// refresh-token controller:
const getRefreshToken = catchAsync(async (req, res) => {
    const { refresh_token } = req.cookies;
    const result = await AuthServices.refreshToken(refresh_token);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access Token is Retrieved Successfully!!!',
        data: result,
    });
});
// forget password controller:
const forgetPassword = catchAsync(async (req, res) => {
    const email = req.body.email; // We use email now
    const result = await AuthServices.forgetPassword(email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'OTP sent to your email. Please verify to reset your password.',
        data: result, // result contains resetToken and otp
    });
});
// reset password controller :
const resetPassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    const result = await AuthServices.resetPassword(req.body, token);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: false,
        message: 'Password Reset Successfully!!!',
        data: result,
    });
});
export const AuthControllers = {
    register,
    login,
    verifyOtp,
    resendOtp,
    changePassword,
    getRefreshToken,
    forgetPassword,
    resetPassword,
};
//# sourceMappingURL=auth.controller.js.map
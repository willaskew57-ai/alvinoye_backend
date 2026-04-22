"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_validation_1 = require("./auth.validation");
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../../../middleware/auth");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router
    .route('/register')
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidations.registerValidationSchema), auth_controller_1.AuthControllers.register);
router
    .route('/login')
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidations.loginValidationSchema), auth_controller_1.AuthControllers.login);
router.route('/logout').post(auth_controller_1.AuthControllers.logout);
router
    .route('/verify-otp')
    .post(
// authLimiter,
(0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(auth_validation_1.AuthValidations.verifyOtpValidationSchema), auth_controller_1.AuthControllers.verifyOtp);
router
    .route('/resend-otp')
    .post(
// authLimiter,
(0, validate_request_1.default)(auth_validation_1.AuthValidations.resendOtpValidationSchema), auth_controller_1.AuthControllers.resendOtp);
router
    .route('/change-password')
    .post((0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(auth_validation_1.AuthValidations.changePasswordValidationSchema), auth_controller_1.AuthControllers.changePassword);
router
    .route('/refresh-token')
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidations.refreshTokenValidationSchema), auth_controller_1.AuthControllers.getRefreshToken);
router
    .route('/forget-password')
    .post((0, validate_request_1.default)(auth_validation_1.AuthValidations.forgetPasswordValidationSchema), auth_controller_1.AuthControllers.forgetPassword);
router
    .route('/reset-password')
    .post((0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(auth_validation_1.AuthValidations.resetPasswordValidationSchema), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map
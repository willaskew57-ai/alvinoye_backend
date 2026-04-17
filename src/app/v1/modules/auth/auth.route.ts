import express from 'express';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';
import { authLimiter } from '../../../../middleware/rate-limiter';

const router = express.Router();

router
  .route('/register')
  .post(
    validateRequest(AuthValidations.registerValidationSchema),
    AuthControllers.register
  );
router
  .route('/login')
  .post(
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.login
  );
router.route('/logout').post(AuthControllers.logout);

router
  .route('/verify-otp')

  .post(
    authLimiter,
    auth(
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.DRIVER,
      USER_ROLE.CUSTOMER
    ),
    validateRequest(AuthValidations.verifyOtpValidationSchema),
    AuthControllers.verifyOtp
  );

router
  .route('/resend-otp')
  .post(
    authLimiter,
    validateRequest(AuthValidations.resendOtpValidationSchema),
    AuthControllers.resendOtp
  );

router
  .route('/change-password')
  .post(
    auth(
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.DRIVER,
      USER_ROLE.CUSTOMER
    ),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword
  );

router
  .route('/refresh-token')
  .post(
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.getRefreshToken
  );

router
  .route('/forget-password')
  .post(
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword
  );

router
  .route('/reset-password')
  .post(
    auth(
      USER_ROLE.SUPER_ADMIN,
      USER_ROLE.ADMIN,
      USER_ROLE.DRIVER,
      USER_ROLE.CUSTOMER
    ),
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword
  );

export const AuthRoutes = router;

import express from 'express';
import { DriverValidation } from './driver.validation';
import { DriverController } from './driver.controller';
import { USER_ROLE } from '../user/user.interface';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
const router = express.Router();
router.post('/info', auth(USER_ROLE.DRIVER), validateRequest(DriverValidation.createDriverWithVehicleValidationSchema), DriverController.registerDriver);
router.get('/get-all', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER), DriverController.getAllDrivers);
router.get('/get/:id', DriverController.getSingleDriver);
router.post('/accept-parcel/:id', auth(USER_ROLE.DRIVER), DriverController.acceptParcel);
router.post('/parcel/verify-otp', auth(USER_ROLE.DRIVER), validateRequest(DriverValidation.verifyParcelOtpValidationSchema), DriverController.verifyParcelOtp);
router.patch('/parcel/:id/complete', auth(USER_ROLE.DRIVER), DriverController.completeParcel);
export const DriverRoutes = router;
//# sourceMappingURL=driver.route.js.map
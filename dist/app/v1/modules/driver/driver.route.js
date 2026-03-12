import express, {} from 'express';
import { DriverValidation } from './driver.validation';
import { DriverController } from './driver.controller';
import { USER_ROLE } from '../user/user.interface';
import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { getLocalFileUrl, upload } from '../../../../utils/fileUploadHelper';
const router = express.Router();
router.post('/info', auth(USER_ROLE.DRIVER), upload.fields([
    { name: 'license_image', maxCount: 1 },
    { name: 'number_plate_image', maxCount: 1 },
    { name: 'vehicle_images', maxCount: 5 },
]), (req, res, next) => {
    if (req.body.data) {
        try {
            req.body = JSON.parse(req.body.data);
        }
        catch (error) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid JSON in 'data' field" });
        }
    }
    next();
}, validateRequest(DriverValidation.createDriverWithVehicleValidationSchema), DriverController.registerDriver);
router.patch('/update-info', auth(USER_ROLE.DRIVER), upload.fields([
    { name: 'license_image', maxCount: 1 },
    { name: 'number_plate_image', maxCount: 1 },
    { name: 'vehicle_images', maxCount: 5 },
]), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const files = req.files;
    // Inject local URLs into req.body before validation
    if (files?.license_image?.[0]) {
        if (!req.body.driverInfo)
            req.body.driverInfo = {};
        req.body.driverInfo.license_image = getLocalFileUrl(files.license_image[0].path);
    }
    if (files?.number_plate_image?.[0]) {
        if (!req.body.vehicle)
            req.body.vehicle = {};
        req.body.vehicle.number_plate_image = getLocalFileUrl(files.number_plate_image[0].path);
    }
    if (files?.vehicle_images) {
        if (!req.body.vehicle)
            req.body.vehicle = {};
        req.body.vehicle.vehicle_images = files.vehicle_images.map((file) => getLocalFileUrl(file.path));
    }
    next();
}, validateRequest(DriverValidation.updateDriverWithVehicleValidationSchema), DriverController.updateDriverInfo);
router.get('/get-all', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER), DriverController.getAllDrivers);
router.get('/get/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DRIVER, USER_ROLE.CUSTOMER), DriverController.getDriverById);
router.get('/get-driver-info', auth(USER_ROLE.DRIVER), DriverController.getSingleDriver);
router.get('/available-for-driver', auth(USER_ROLE.DRIVER), DriverController.getAvailableParcelsForDriver);
router.patch('/accept-parcel/:id', auth(USER_ROLE.DRIVER), DriverController.acceptParcel);
router.post('/parcel/verify-otp', auth(USER_ROLE.DRIVER), validateRequest(DriverValidation.verifyParcelOtpValidationSchema), DriverController.verifyParcelOtp);
export const DriverRoutes = router;
//# sourceMappingURL=driver.route.js.map
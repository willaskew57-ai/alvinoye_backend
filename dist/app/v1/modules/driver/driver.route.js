"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const driver_validation_1 = require("./driver.validation");
const driver_controller_1 = require("./driver.controller");
const user_interface_1 = require("../user/user.interface");
const auth_1 = require("../../../../middleware/auth");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const multer_s3_uploader_1 = require("../../../../aws/multer-s3-uploader");
const router = express_1.default.Router();
router.post('/info', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
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
}, (0, validate_request_1.default)(driver_validation_1.DriverValidation.createDriverWithVehicleValidationSchema), driver_controller_1.DriverController.registerDriver);
router.patch('/update-info', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const files = req.files;
    // Inject local URLs into req.body before validation
    if (files?.license_image?.[0]) {
        if (!req.body.driverInfo)
            req.body.driverInfo = {};
        req.body.driverInfo.license_image = (0, multer_s3_uploader_1.getCloudFrontUrl)(files.license_image[0].key);
    }
    if (files?.number_plate_image?.[0]) {
        if (!req.body.vehicle)
            req.body.vehicle = {};
        req.body.vehicle.number_plate_image = (0, multer_s3_uploader_1.getCloudFrontUrl)(files.number_plate_image[0].key);
    }
    if (files?.vehicle_images) {
        if (!req.body.vehicle)
            req.body.vehicle = {};
        req.body.vehicle.vehicle_images = files.vehicle_images.map((file) => (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key));
    }
    next();
}, (0, validate_request_1.default)(driver_validation_1.DriverValidation.updateDriverWithVehicleValidationSchema), driver_controller_1.DriverController.updateDriverInfo);
router.get('/get-all', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), driver_controller_1.DriverController.getAllDrivers);
router.get('/get/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), driver_controller_1.DriverController.getDriverById);
router.get('/get-driver-info', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), driver_controller_1.DriverController.getSingleDriver);
router.get('/available-for-driver', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(driver_validation_1.DriverValidation.getAvailableParcelsValidationSchema), driver_controller_1.DriverController.getAvailableParcelsForDriver);
router.patch('/accept-parcel/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), driver_controller_1.DriverController.acceptParcel);
router.post('/parcel/verify-otp', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(driver_validation_1.DriverValidation.verifyParcelOtpValidationSchema), driver_controller_1.DriverController.verifyParcelOtp);
router.post('/parcel/select', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(driver_validation_1.DriverValidation.selectParcelValidationSchema), driver_controller_1.DriverController.selectParcel);
exports.DriverRoutes = router;
//# sourceMappingURL=driver.route.js.map
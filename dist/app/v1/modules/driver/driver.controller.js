"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const driver_service_1 = require("./driver.service");
const fileUploadHelper_1 = require("../../../../utils/fileUploadHelper");
const registerDriver = (0, catch_async_1.default)(async (req, res) => {
    const user_id = req.user.user_id;
    const files = req.files;
    if (!req.body.driverInfo)
        req.body.driverInfo = {};
    if (!req.body.vehicle)
        req.body.vehicle = {};
    if (files?.license_image?.[0]) {
        req.body.driverInfo.license_image = (0, fileUploadHelper_1.getLocalFileUrl)(files.license_image[0].path);
    }
    if (files?.number_plate_image?.[0]) {
        req.body.vehicle.number_plate_image = (0, fileUploadHelper_1.getLocalFileUrl)(files.number_plate_image[0].path);
    }
    // 3. Handle Multiple Vehicle Images (Array)
    if (files?.vehicle_images) {
        req.body.vehicle.vehicle_images = files.vehicle_images.map((file) => (0, fileUploadHelper_1.getLocalFileUrl)(file.path));
    }
    const result = await driver_service_1.DriverServices.addDriverInfoIntoDB(req.body, user_id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Driver profile created successfully!',
        data: result,
    });
});
// driver.controller.ts
const updateDriverInfo = (0, catch_async_1.default)(async (req, res) => {
    const user_id = req.user.user_id;
    const result = await driver_service_1.DriverServices.updateDriverInfoInDB(user_id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver info updated successfully',
        data: result,
    });
});
const getAllDrivers = (0, catch_async_1.default)(async (req, res) => {
    const result = await driver_service_1.DriverServices.getAllDriversFromDB(req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Drivers retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
const getSingleDriver = (0, catch_async_1.default)(async (req, res) => {
    const driver = req.user;
    const result = await driver_service_1.DriverServices.getSingleDriverFromDB(driver.user_id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver retrieved successfully!',
        data: result,
    });
});
const getDriverById = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await driver_service_1.DriverServices.getSingleDriverFromDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Driver retrieved successfully!',
        data: result,
    });
});
// ** ------------- parcel related api ------------- ** //
const getAvailableParcelsForDriver = (0, catch_async_1.default)(async (req, res) => {
    const user_id = req.user.user_id;
    const result = await driver_service_1.DriverServices.getAvailableParcelsFromDB(user_id, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Available parcels fetched successfully!',
        data: result,
    });
});
const acceptParcel = (0, catch_async_1.default)(async (req, res) => {
    const driverId = req.user.user_id;
    const result = await driver_service_1.DriverServices.acceptParcelFromDB(req.params.id, driverId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel accepted successfully',
        data: result,
    });
});
const verifyParcelOtp = (0, catch_async_1.default)(async (req, res) => {
    const { parcel_id, otp } = req.body;
    const result = await driver_service_1.DriverServices.verifyParcelOtpFromDB({
        parcel_id,
        otp,
    });
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel OTP verified successfully',
        data: result,
    });
});
exports.DriverController = {
    registerDriver,
    updateDriverInfo,
    getAllDrivers,
    getSingleDriver,
    acceptParcel,
    verifyParcelOtp,
    getAvailableParcelsForDriver,
    getDriverById,
};
//# sourceMappingURL=driver.controller.js.map
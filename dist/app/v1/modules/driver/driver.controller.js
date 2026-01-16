import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { DriverServices } from './driver.service';
const registerDriver = catchAsync(async (req, res) => {
    const user_id = req.user.user_id;
    console.log('User ID from token:', req.user);
    const result = await DriverServices.addDriverInfoIntoDB(req.body, user_id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Driver profile created successfully!',
        data: result,
    });
});
const getAllDrivers = catchAsync(async (req, res) => {
    const result = await DriverServices.getAllDriversFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Drivers retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
});
const getSingleDriver = catchAsync(async (req, res) => {
    const { id } = req.params;
    const driverId = id;
    const result = await DriverServices.getSingleDriverFromDB(driverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Driver retrieved successfully!',
        data: result,
    });
});
// ** ------------- parcel related api ------------- ** //
const acceptParcel = catchAsync(async (req, res) => {
    const driverId = req.user.user_id;
    const result = await DriverServices.acceptParcelFromDB(req.params.id, driverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel accepted successfully',
        data: result,
    });
});
const verifyParcelOtp = catchAsync(async (req, res) => {
    const { parcel_id, otp } = req.body;
    const result = await DriverServices.verifyParcelOtpFromDB({
        parcel_id,
        otp,
    });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel OTP verified successfully',
        data: result,
    });
});
/**
 * Complete Parcel (after OTP verification)
 */
const completeParcel = catchAsync(async (req, res) => {
    const { id } = req.params;
    const driver_id = req.user.user_id;
    const result = await DriverServices.completeParcelFromDB(id, driver_id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel completed successfully',
        data: result,
    });
});
export const DriverController = {
    registerDriver,
    getAllDrivers,
    getSingleDriver,
    acceptParcel,
    verifyParcelOtp,
    completeParcel,
};
//# sourceMappingURL=driver.controller.js.map
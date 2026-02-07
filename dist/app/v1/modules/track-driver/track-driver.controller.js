import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { TrackDriverServices } from './track-driver.service';
/**
 * @route POST /api/v1/track-driver/update-location
 * @desc Update driver's current location
 * @access Private - Driver only
 */
const updateLocation = catchAsync(async (req, res) => {
    const driverId = req.user?.user_id;
    const payload = {
        ...req.body,
        driver_id: driverId,
    };
    const result = await TrackDriverServices.updateDriverLocationInDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Location updated successfully',
        data: result,
    });
});
/**
 * @route GET /api/v1/track-driver/:driverId
 * @desc Get driver's current location
 * @access Private
 */
const getDriverLocation = catchAsync(async (req, res) => {
    const { driverId } = req.params;
    const result = await TrackDriverServices.getDriverLocationFromDB(driverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Driver location retrieved successfully',
        data: result,
    });
});
/**
 * @route GET /api/v1/track-driver/:driverId/history
 * @desc Get driver's location history
 * @access Private
 */
const getLocationHistory = catchAsync(async (req, res) => {
    const { driverId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const result = await TrackDriverServices.getLocationHistoryFromDB(driverId, limit);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Location history retrieved successfully',
        data: result,
    });
});
/**
 * @route GET /api/v1/track-driver/parcel/:parcelId
 * @desc Get driver location for a specific parcel
 * @access Private
 */
const getParcelDriverLocation = catchAsync(async (req, res) => {
    const { parcelId } = req.params;
    const result = await TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel driver location retrieved successfully',
        data: result,
    });
});
/**
 * @route POST /api/v1/track-driver/offline
 * @desc Mark driver as offline
 * @access Private - Driver only
 */
const markOffline = catchAsync(async (req, res) => {
    const driverId = req.user?.user_id;
    const result = await TrackDriverServices.markDriverOfflineInDB(driverId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Driver marked as offline',
        data: result,
    });
});
/**
 * @route GET /api/v1/track-driver/nearby
 * @desc Get nearby online drivers
 * @access Private
 */
const getNearbyDrivers = catchAsync(async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
    }
    const result = await TrackDriverServices.getNearbyDriversFromDB(parseFloat(latitude), parseFloat(longitude), radius ? parseFloat(radius) : 10);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Nearby drivers retrieved successfully',
        data: result,
    });
});
export const TrackDriverControllers = {
    updateLocation,
    getDriverLocation,
    getLocationHistory,
    getParcelDriverLocation,
    markOffline,
    getNearbyDrivers,
};
//# sourceMappingURL=track-driver.controller.js.map
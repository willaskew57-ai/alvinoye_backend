"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDriverControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const track_driver_service_1 = require("./track-driver.service");
/**
 * @route POST /api/v1/track-driver/update-location
 * @desc Update driver's current location
 * @access Private - Driver only
 */
const updateLocation = (0, catch_async_1.default)(async (req, res) => {
    const driverId = req.user?.user_id;
    const payload = {
        ...req.body,
        driver_id: driverId,
    };
    const result = await track_driver_service_1.TrackDriverServices.updateDriverLocationInDB(payload);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const getDriverLocation = (0, catch_async_1.default)(async (req, res) => {
    const { driverId } = req.params;
    const result = await track_driver_service_1.TrackDriverServices.getDriverLocationFromDB(driverId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const getLocationHistory = (0, catch_async_1.default)(async (req, res) => {
    const { driverId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const result = await track_driver_service_1.TrackDriverServices.getLocationHistoryFromDB(driverId, limit);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const getParcelDriverLocation = (0, catch_async_1.default)(async (req, res) => {
    const { parcelId } = req.params;
    const result = await track_driver_service_1.TrackDriverServices.getParcelDriverLocationFromDB(parcelId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const markOffline = (0, catch_async_1.default)(async (req, res) => {
    const driverId = req.user?.user_id;
    const result = await track_driver_service_1.TrackDriverServices.markDriverOfflineInDB(driverId);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
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
const getNearbyDrivers = (0, catch_async_1.default)(async (req, res) => {
    const { latitude, longitude, radius } = req.query;
    if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required');
    }
    const result = await track_driver_service_1.TrackDriverServices.getNearbyDriversFromDB(parseFloat(latitude), parseFloat(longitude), radius ? parseFloat(radius) : 10);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Nearby drivers retrieved successfully',
        data: result,
    });
});
exports.TrackDriverControllers = {
    updateLocation,
    getDriverLocation,
    getLocationHistory,
    getParcelDriverLocation,
    markOffline,
    getNearbyDrivers,
};
//# sourceMappingURL=track-driver.controller.js.map
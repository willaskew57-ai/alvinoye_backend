"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../../middleware/auth");
const track_driver_controller_1 = require("./track-driver.controller");
const user_interface_1 = require("../user/user.interface");
const track_driver_validation_1 = require("./track-driver.validation");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const router = express_1.default.Router();
/**
 * @route POST /api/v1/track-driver/update-location
 * @desc Update driver's current location
 * @access Private - Driver only
 */
router.post('/update-location', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(track_driver_validation_1.TrackDriverValidation.updateLocationValidationSchema), track_driver_controller_1.TrackDriverControllers.updateLocation);
/**
 * @route POST /api/v1/track-driver/offline
 * @desc Mark driver as offline
 * @access Private - Driver only
 */
router.post('/offline', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), track_driver_controller_1.TrackDriverControllers.markOffline);
/**
 * @route GET /api/v1/track-driver/nearby
 * @desc Get nearby online drivers
 * @access Private - Admin/Customer
 */
router.get('/nearby', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(track_driver_validation_1.TrackDriverValidation.getNearbyDriversQuerySchema), track_driver_controller_1.TrackDriverControllers.getNearbyDrivers);
/**
 * @route GET /api/v1/track-driver/parcel/:parcelId
 * @desc Get driver location for a specific parcel
 * @access Private
 */
router.get('/parcel/:parcelId', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), track_driver_controller_1.TrackDriverControllers.getParcelDriverLocation);
/**
 * @route GET /api/v1/track-driver/:driverId/history
 * @desc Get driver's location history
 * @access Private - Admin only
 */
router.get('/:driverId/history', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), track_driver_controller_1.TrackDriverControllers.getLocationHistory);
/**
 * @route GET /api/v1/track-driver/:driverId
 * @desc Get driver's current location
 * @access Private
 */
router.get('/:driverId', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.DRIVER), track_driver_controller_1.TrackDriverControllers.getDriverLocation);
exports.TrackDriverRoutes = router;
//# sourceMappingURL=track-driver.routes.js.map
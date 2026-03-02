import express from 'express';
import { auth } from '../../../../middleware/auth';
import { TrackDriverControllers } from './track-driver.controller';
import { USER_ROLE } from '../user/user.interface';
import { TrackDriverValidation } from './track-driver.validation';
import validateRequest from '../../../../middleware/validate-request';
const router = express.Router();
/**
 * @route POST /api/v1/track-driver/update-location
 * @desc Update driver's current location
 * @access Private - Driver only
 */
router.post('/update-location', auth(USER_ROLE.DRIVER), validateRequest(TrackDriverValidation.updateLocationValidationSchema), TrackDriverControllers.updateLocation);
/**
 * @route POST /api/v1/track-driver/offline
 * @desc Mark driver as offline
 * @access Private - Driver only
 */
router.post('/offline', auth(USER_ROLE.DRIVER), TrackDriverControllers.markOffline);
/**
 * @route GET /api/v1/track-driver/nearby
 * @desc Get nearby online drivers
 * @access Private - Admin/Customer
 */
router.get('/nearby', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.CUSTOMER), validateRequest(TrackDriverValidation.getNearbyDriversQuerySchema), TrackDriverControllers.getNearbyDrivers);
/**
 * @route GET /api/v1/track-driver/parcel/:parcelId
 * @desc Get driver location for a specific parcel
 * @access Private
 */
router.get('/parcel/:parcelId', auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), TrackDriverControllers.getParcelDriverLocation);
/**
 * @route GET /api/v1/track-driver/:driverId/history
 * @desc Get driver's location history
 * @access Private - Admin only
 */
router.get('/:driverId/history', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), TrackDriverControllers.getLocationHistory);
/**
 * @route GET /api/v1/track-driver/:driverId
 * @desc Get driver's current location
 * @access Private
 */
router.get('/:driverId', auth(USER_ROLE.CUSTOMER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.DRIVER), TrackDriverControllers.getDriverLocation);
export const TrackDriverRoutes = router;
//# sourceMappingURL=track-driver.routes.js.map
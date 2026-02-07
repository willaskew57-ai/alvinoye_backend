import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { DriverLocation } from './track-driver.model';
import { getIO } from '../../../../socket';
/**
 * Update driver's current location
 */
const updateDriverLocationInDB = async (payload) => {
    const locationData = {
        driver_id: payload.driver_id,
        latitude: payload.latitude,
        longitude: payload.longitude,
        parcel_id: payload.parcel_id,
        heading: payload.heading,
        speed: payload.speed,
        accuracy: payload.accuracy,
        is_online: true,
        last_updated: new Date(),
    };
    // Upsert: Update if exists, create if not
    const location = await DriverLocation.findOneAndUpdate({ driver_id: payload.driver_id }, locationData, {
        new: true,
        upsert: true,
        runValidators: true,
    }).populate('driver_id', 'full_name phone_number profile_image');
    // Emit location update via Socket.IO
    try {
        const io = getIO();
        // Emit to driver's room
        io.to(`driver_${payload.driver_id}`).emit('location_updated', {
            location: location.toJSON(),
        });
        // If tracking a parcel, emit to parcel room
        if (payload.parcel_id) {
            io.to(`parcel_${payload.parcel_id}`).emit('driver_location', {
                driver_id: payload.driver_id,
                location: {
                    latitude: payload.latitude,
                    longitude: payload.longitude,
                    heading: payload.heading,
                    speed: payload.speed,
                    last_updated: location.last_updated,
                },
            });
        }
    }
    catch (error) {
        console.error('Failed to emit location update via socket:', error);
    }
    // Save to history
    await saveLocationHistory(payload);
    return location;
};
/**
 * Get driver's current location
 */
const getDriverLocationFromDB = async (driverId) => {
    const location = await DriverLocation.findOne({
        driver_id: driverId,
    })
        .populate('driver_id', 'full_name phone_number profile_image')
        .populate('parcel_id', 'parcel_id parcel_name');
    return location;
};
/**
 * Get location history for a driver
 */
const getLocationHistoryFromDB = async (driverId, limit = 50) => {
    const history = await DriverLocation.find({
        driver_id: driverId,
    })
        .sort({ created_at: -1 })
        .limit(limit)
        .select('latitude longitude created_at speed heading');
    return history.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.created_at,
        speed: loc.speed ?? undefined,
        heading: loc.heading ?? undefined,
    }));
};
/**
 * Get location for a specific parcel's driver
 */
const getParcelDriverLocationFromDB = async (parcelId) => {
    const location = await DriverLocation.findOne({
        parcel_id: parcelId,
        is_online: true,
    })
        .sort({ last_updated: -1 })
        .populate('driver_id', 'full_name phone_number profile_image')
        .populate('parcel_id', 'parcel_id parcel_name status');
    if (!location) {
        throw new AppError(httpStatus.NOT_FOUND, 'No active driver found for this parcel');
    }
    return location;
};
/**
 * Mark driver as offline
 */
const markDriverOfflineInDB = async (driverId) => {
    const location = await DriverLocation.findOneAndUpdate({ driver_id: driverId }, {
        is_online: false,
        last_updated: new Date(),
    }, { new: true });
    // Emit offline status via Socket.IO
    try {
        const io = getIO();
        io.to(`driver_${driverId}`).emit('driver_offline', {
            driver_id: driverId,
            timestamp: new Date(),
        });
    }
    catch (error) {
        console.error('Failed to emit offline status via socket:', error);
    }
    return location;
};
/**
 * Get all online drivers within a radius (in kilometers)
 */
const getNearbyDriversFromDB = async (latitude, longitude, radiusKm = 10) => {
    // Convert km to radians (Earth radius ≈ 6371 km)
    const radiusRad = radiusKm / 6371;
    const drivers = await DriverLocation.find({
        is_online: true,
        latitude: {
            $gte: latitude - radiusRad * (180 / Math.PI),
            $lte: latitude + radiusRad * (180 / Math.PI),
        },
        longitude: {
            $gte: longitude - radiusRad * (180 / Math.PI),
            $lte: longitude + radiusRad * (180 / Math.PI),
        },
    })
        .populate('driver_id', 'full_name phone_number profile_image rating')
        .sort({ last_updated: -1 });
    return drivers;
};
/**
 * Save location to history (for analytics/route replay)
 */
const saveLocationHistory = async (payload) => {
    try {
        const historyData = {
            driver_id: payload.driver_id,
            latitude: payload.latitude,
            longitude: payload.longitude,
            heading: payload.heading,
            speed: payload.speed,
            accuracy: payload.accuracy,
            is_online: true,
            last_updated: new Date(),
        };
        if (payload.parcel_id) {
            historyData.parcel_id = payload.parcel_id;
        }
        await DriverLocation.create(historyData);
    }
    catch (error) {
        console.error('Failed to save location history:', error);
    }
};
export const TrackDriverServices = {
    updateDriverLocationInDB,
    getDriverLocationFromDB,
    getLocationHistoryFromDB,
    getParcelDriverLocationFromDB,
    markDriverOfflineInDB,
    getNearbyDriversFromDB,
};
//# sourceMappingURL=track-driver.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDriverServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const track_driver_model_1 = require("./track-driver.model");
const socket_1 = require("../../../../socket");
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
    const location = await track_driver_model_1.DriverLocation.findOneAndUpdate({ driver_id: payload.driver_id }, locationData, {
        new: true,
        upsert: true,
        runValidators: true,
    }).populate('driver_id', 'full_name phone_number profile_image');
    try {
        const io = (0, socket_1.getIO)();
        io.to(`driver_${payload.driver_id}`).emit('location_updated', {
            location: location.toJSON(),
        });
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
    await saveLocationHistory(payload);
    return location;
};
const getDriverLocationFromDB = async (driverId) => {
    const location = await track_driver_model_1.DriverLocation.findOne({
        driver_id: driverId,
    })
        .populate('driver_id', 'full_name phone_number profile_image')
        .populate('parcel_id', 'parcel_id parcel_name');
    return location;
};
const getLocationHistoryFromDB = async (driverId, limit = 50) => {
    const history = await track_driver_model_1.DriverLocation.find({
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
const getParcelDriverLocationFromDB = async (parcelId) => {
    const location = await track_driver_model_1.DriverLocation.findOne({
        parcel_id: parcelId,
        is_online: true,
    })
        .sort({ last_updated: -1 })
        .populate('driver_id', 'full_name phone_number profile_image')
        .populate('parcel_id', 'parcel_id parcel_name status');
    if (!location) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'No active driver found for this parcel');
    }
    return location;
};
const markDriverOfflineInDB = async (driverId) => {
    const location = await track_driver_model_1.DriverLocation.findOneAndUpdate({ driver_id: driverId }, {
        is_online: false,
        last_updated: new Date(),
    }, { new: true });
    try {
        const io = (0, socket_1.getIO)();
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
const getNearbyDriversFromDB = async (latitude, longitude, radiusKm = 10) => {
    const radiusRad = radiusKm / 6371;
    const drivers = await track_driver_model_1.DriverLocation.find({
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
        await track_driver_model_1.DriverLocation.create(historyData);
    }
    catch (error) {
        console.error('Failed to save location history:', error);
    }
};
exports.TrackDriverServices = {
    updateDriverLocationInDB,
    getDriverLocationFromDB,
    getLocationHistoryFromDB,
    getParcelDriverLocationFromDB,
    markDriverOfflineInDB,
    getNearbyDriversFromDB,
};
//# sourceMappingURL=track-driver.service.js.map
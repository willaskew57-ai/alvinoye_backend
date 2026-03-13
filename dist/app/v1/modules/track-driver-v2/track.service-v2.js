"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackDriverServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const socket_1 = require("../../../../socket"); // Import the getIO helper
const track_driver_model_1 = require("./track-driver.model");
/**
 * Updates driver coordinates in DB and broadcasts to the parcel room.
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
    const location = await track_driver_model_1.DriverLocation.findOneAndUpdate({ driver_id: payload.driver_id }, locationData, { new: true, upsert: true, runValidators: true }).populate('driver_id', 'full_name phone_number profile_image');
    try {
        const io = (0, socket_1.getIO)();
        io.to(`driver_${payload.driver_id}`).emit('location_updated', {
            location: location.toJSON(),
        });
        if (payload.parcel_id) {
            io.to(`parcel_${payload.parcel_id}`).emit('driver_location_update', {
                driver_id: payload.driver_id,
                parcel_id: payload.parcel_id,
                latitude: payload.latitude,
                longitude: payload.longitude,
                heading: payload.heading,
                speed: payload.speed,
                last_updated: location.last_updated,
            });
        }
    }
    catch (error) {
        console.error('Failed to emit location update via socket:', error);
    }
    await saveLocationHistory(payload);
    console.log(location, "Updated Location");
    return location;
};
/**
 * Retrieves the current location for a customer tracking a parcel.
 */
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
    console.log(location, "location");
    return location;
};
// Private helper to save historical movement
const saveLocationHistory = async (payload) => {
    try {
        await track_driver_model_1.DriverLocation.create({
            ...payload,
            is_online: true,
            created_at: new Date(),
        });
    }
    catch (error) {
        console.error('Failed to save location history:', error);
    }
};
exports.TrackDriverServices = {
    updateDriverLocationInDB,
    getParcelDriverLocationFromDB,
};
//# sourceMappingURL=track.service-v2.js.map
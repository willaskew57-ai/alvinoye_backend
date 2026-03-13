"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const driver_model_1 = require("./driver.model");
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const mongoose_1 = __importStar(require("mongoose"));
const vehicle_model_1 = require("../vehicle/vehicle.model");
const user_model_1 = __importDefault(require("../user/user.model"));
const parcel_model_1 = require("../parcel/parcel.model");
const parcel_interface_1 = require("../parcel/parcel.interface");
const otp_services_1 = require("../otp/otp.services");
const email_helper_1 = require("../../../../utils/email-helper");
const send_sms_1 = require("../../../../utils/send-sms");
const deleteFromS3_1 = require("../../../../aws/deleteFromS3");
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const axios_1 = __importDefault(require("axios"));
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
const addDriverInfoIntoDB = async (payload, userIdFromToken) => {
    const { driverInfo, vehicle } = payload;
    const finalUserId = driverInfo.user_id || userIdFromToken;
    if (!finalUserId) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'User ID is required!');
    }
    const isDriverExists = await driver_model_1.Driver.findOne({ user_id: finalUserId });
    if (isDriverExists) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, 'Driver profile already exists!');
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const driverData = { ...driverInfo, user_id: finalUserId };
        const newDriver = await driver_model_1.Driver.create([driverData], { session });
        const vehicleData = {
            ...vehicle,
            user_id: finalUserId,
        };
        const newVehicle = await vehicle_model_1.Vehicle.create([vehicleData], { session });
        const updatedUser = await user_model_1.default.findByIdAndUpdate(finalUserId, { is_profile_completed: true, status: 'ACTIVE' }, { session, new: true });
        if (!updatedUser) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        await session.commitTransaction();
        return {
            driver: newDriver[0],
            vehicle: newVehicle[0],
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, error.message || 'Registration failed');
    }
    finally {
        await session.endSession();
    }
};
const updateDriverInfoInDB = async (userId, payload) => {
    const { driverInfo, vehicle } = payload;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (driverInfo) {
            const existingDriver = await driver_model_1.Driver.findOne({ user_id: userId });
            if (driverInfo.license_image && existingDriver?.license_image) {
                (0, deleteFromS3_1.deleteFileFromS3)(existingDriver.license_image);
            }
            await driver_model_1.Driver.findOneAndUpdate({ user_id: userId }, driverInfo, {
                session,
            });
        }
        if (vehicle) {
            const existingVehicle = await vehicle_model_1.Vehicle.findOne({ user_id: userId });
            if (!existingVehicle)
                throw new Error('Vehicle not found');
            let finalImages = existingVehicle.vehicle_images || [];
            if (vehicle.existing_vehicle_images) {
                const toDelete = existingVehicle.vehicle_images.filter((img) => !vehicle.existing_vehicle_images.includes(img));
                toDelete.forEach((img) => (0, deleteFromS3_1.deleteFileFromS3)(img));
                finalImages = vehicle.existing_vehicle_images;
            }
            if (vehicle.vehicle_images) {
                finalImages = [...finalImages, ...vehicle.vehicle_images];
            }
            if (vehicle.number_plate_image && existingVehicle.number_plate_image) {
                (0, deleteFromS3_1.deleteFileFromS3)(existingVehicle.number_plate_image);
            }
            const vehicleData = { ...vehicle, vehicle_images: finalImages };
            delete vehicleData.existing_vehicle_images;
            await vehicle_model_1.Vehicle.findOneAndUpdate({ user_id: userId }, vehicleData, {
                session,
            });
        }
        await session.commitTransaction();
        return await driver_model_1.Driver.findOne({ user_id: userId }).populate('vehicle');
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
const getAllDriversFromDB = async (query) => {
    const queryObj = { ...query };
    const search = query?.search;
    let driverIdsFromLocation = null;
    let driverIdsFromLicenseSearch = null;
    let vehicleMatchingUserIds = null;
    if (query?.from || query?.to) {
        const locConditions = {};
        if (query.from) {
            locConditions['from.address'] = {
                $regex: query.from,
                $options: 'i',
            };
        }
        if (query.to) {
            locConditions['to.address'] = {
                $regex: query.to,
                $options: 'i',
            };
        }
        const drivers = await driver_model_1.Driver.find(locConditions).select('user_id');
        driverIdsFromLocation = drivers.map((d) => d.user_id.toString());
    }
    if (search) {
        const drivers = await driver_model_1.Driver.find({
            driver_license_number: { $regex: search, $options: 'i' },
        }).select('user_id');
        driverIdsFromLicenseSearch = drivers.map((d) => d.user_id.toString());
    }
    if (query?.vehicle_type) {
        const vehicles = await vehicle_model_1.Vehicle.find({
            vehicle_type: query.vehicle_type,
        }).select('user_id');
        vehicleMatchingUserIds = vehicles.map((v) => v.user_id.toString());
    }
    const excludeFields = [
        'status',
        'vehicle_type',
        'search',
        'from',
        'to',
        'limit',
        'page',
        'sort',
        'fields',
    ];
    excludeFields.forEach((el) => delete queryObj[el]);
    const userQuery = new query_builder_1.default(user_model_1.default.find({ role: 'DRIVER', is_profile_completed: true })
        .populate('driver_info')
        .populate('vehicle'), queryObj);
    if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        userQuery.modelQuery = userQuery.modelQuery.find({
            $or: [
                { full_name: searchRegex },
                { email: searchRegex },
                { _id: { $in: driverIdsFromLicenseSearch || [] } },
            ],
        });
    }
    if (driverIdsFromLocation !== null) {
        userQuery.modelQuery = userQuery.modelQuery.find({
            _id: { $in: driverIdsFromLocation },
        });
    }
    if (vehicleMatchingUserIds !== null) {
        userQuery.modelQuery = userQuery.modelQuery.find({
            _id: { $in: vehicleMatchingUserIds },
        });
    }
    if (query?.status) {
        userQuery.modelQuery = userQuery.modelQuery.find({ status: query.status });
    }
    userQuery.filter().sort().paginate().fields();
    const data = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return { meta, data };
};
const getSingleDriverFromDB = async (id) => {
    const result = await user_model_1.default.findOne({ _id: id, role: 'DRIVER' })
        .populate('driver_info')
        .populate('vehicle');
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Driver not found!');
    }
    return result;
};
// Haversine formula to calculate distance in km between two coordinates
const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
const getAvailableParcelsFromDB = async (userId, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const driver = await driver_model_1.Driver.findOne({ user_id: userId });
    const vehicle = await vehicle_model_1.Vehicle.findOne({ user_id: userId });
    if (!driver) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Driver profile not found!');
    }
    if (!vehicle) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Vehicle profile not found!');
    }
    const potentialParcels = await parcel_model_1.Parcel.find({
        status: parcel_interface_1.PARCEL_STATUS.PENDING,
        vehicle_type: vehicle.vehicle_type,
        price_status: parcel_interface_1.PRICE_STATUS.ACCEPTED,
        accepted_by: null,
    }).lean();
    if (potentialParcels.length === 0) {
        return {
            meta: { total: 0, page, limit, totalPages: 0 },
            data: [],
        };
    }
    // Geographic pre-filter using Haversine distance:
    // parcel pickup must be within 50 km of driver's from-location
    // parcel handover must be within 50 km of driver's to-location
    const PICKUP_RADIUS_KM = 50;
    const HANDOVER_RADIUS_KM = 50;
    const geoPrefilteredParcels = potentialParcels.filter((parcel) => {
        const pickupDist = haversineDistanceKm(driver.from.latitude, driver.from.longitude, parcel.pickup_location.latitude, parcel.pickup_location.longitude);
        const handoverDist = haversineDistanceKm(driver.to.latitude, driver.to.longitude, parcel.handover_location.latitude, parcel.handover_location.longitude);
        return pickupDist <= PICKUP_RADIUS_KM && handoverDist <= HANDOVER_RADIUS_KM;
    });
    if (geoPrefilteredParcels.length === 0) {
        return {
            meta: { total: 0, page, limit, totalPages: 0 },
            data: [],
        };
    }
    const apiKey = env_config_1.default.google_maps_api_key;
    const allMatchedParcels = [];
    const driverOrigin = `${driver.from.latitude},${driver.from.longitude}`;
    const driverDestination = `${driver.to.latitude},${driver.to.longitude}`;
    // Get baseline driver route distance
    let originalDistance = 0;
    let baselineAvailable = false;
    try {
        const originalRouteRes = await axios_1.default.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&key=${apiKey}`);
        if (originalRouteRes.data.status === 'OK') {
            originalDistance = originalRouteRes.data.routes[0].legs[0].distance.value;
            baselineAvailable = true;
        }
    }
    catch (error) {
        console.error('Failed to get baseline distance', error);
    }
    const DETOUR_THRESHOLD_KM = 20;
    for (const parcel of geoPrefilteredParcels) {
        try {
            const pickup = `${parcel.pickup_location.latitude},${parcel.pickup_location.longitude}`;
            const handover = `${parcel.handover_location.latitude},${parcel.handover_location.longitude}`;
            // If Google Maps API key is unavailable or baseline failed, rely on geo pre-filter alone
            if (!apiKey || !baselineAvailable) {
                const pickupDist = haversineDistanceKm(driver.from.latitude, driver.from.longitude, parcel.pickup_location.latitude, parcel.pickup_location.longitude);
                allMatchedParcels.push({
                    ...parcel,
                    distance_info: {
                        parcel_actual_distance: `~${pickupDist.toFixed(1)} km from your start`,
                    },
                });
                continue;
            }
            const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&waypoints=${pickup}|${handover}&key=${apiKey}`;
            const response = await axios_1.default.get(googleUrl);
            if (response.data.status === 'OK') {
                const legs = response.data.routes[0].legs;
                // legs[0]: driverOrigin → pickup
                // legs[1]: pickup → handover
                // legs[2]: handover → driverDestination
                const totalDistanceWithParcel = legs.reduce((acc, leg) => acc + leg.distance.value, 0);
                const parcelDistanceText = legs[1]?.distance?.text ?? '';
                const detourKm = (totalDistanceWithParcel - originalDistance) / 1000;
                if (detourKm <= DETOUR_THRESHOLD_KM) {
                    allMatchedParcels.push({
                        ...parcel,
                        distance_info: {
                            parcel_actual_distance: parcelDistanceText,
                            detour_km: Math.round(detourKm * 10) / 10,
                        },
                    });
                }
            }
        }
        catch (error) {
            console.error('Error calculating route for parcel:', parcel._id);
            // On API error, fall back to including geo-pre-filtered parcel
            allMatchedParcels.push({
                ...parcel,
                distance_info: { parcel_actual_distance: 'N/A' },
            });
        }
    }
    const total = allMatchedParcels.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedData = allMatchedParcels.slice(skip, skip + limit);
    return {
        meta: { total, page, limit, totalPages },
        data: paginatedData,
    };
};
const acceptParcelFromDB = async (parcelId, driverIdFromToken) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const parcel = await parcel_model_1.Parcel.findById(parcelId).session(session);
        if (!parcel) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found');
        }
        if (parcel.status !== parcel_interface_1.PARCEL_STATUS.PENDING) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel is not available for acceptance');
        }
        parcel.status = parcel_interface_1.PARCEL_STATUS.ONGOING;
        parcel.accepted_by = new mongoose_1.Types.ObjectId(driverIdFromToken);
        parcel.accepted_at = new Date();
        await parcel.save({ session });
        const parcelOwner = await user_model_1.default.findById(parcel.user_id).session(session);
        if (!parcelOwner) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel owner not found');
        }
        const otp = await otp_services_1.OtpServices.generateAndSaveOtp({
            parcel_id: parcel._id,
            purpose: 'PARCEL',
        });
        console.log(otp);
        await email_helper_1.EmailHelpers.sendParcelOtpEmail({
            email: parcelOwner.email,
            name: parcelOwner.full_name,
            verificationCode: otp,
        });
        await session.commitTransaction();
        // Send SMS to receiver with parcel OTP (after transaction commits)
        if (parcel.receiver_phone) {
            const smsMessage = `Your parcel "${parcel.parcel_name}" has been picked up. Your verification OTP is: ${otp}. Please share this OTP with the driver for delivery confirmation.`;
            try {
                const smsResult = await (0, send_sms_1.sendSms)(parcel.receiver_phone, smsMessage);
                if (!smsResult.success) {
                    console.error('Failed to send SMS to receiver:', smsResult.error);
                }
            }
            catch (smsError) {
                console.error('Error sending SMS to receiver:', smsError);
            }
        }
        try {
            const driverUser = await user_model_1.default.findById(driverIdFromToken);
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: parcel.user_id,
                type: notification_constant_1.NOTIFICATION_TYPE.PARCEL_ACCEPTED,
                title: 'Parcel Accepted',
                message: `Driver ${driverUser?.full_name || 'has'} accepted your parcel "${parcel.parcel_name}".`,
                parcel_id: parcel._id,
                data: {
                    parcel_name: parcel.parcel_name,
                    driver_id: driverIdFromToken,
                },
            });
        }
        catch (error) {
            console.error('Failed to create notification:', error);
        }
        return {
            message: 'Parcel accepted successfully',
            parcel_id: parcel._id,
            status: parcel.status,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, error.message || 'Failed to accept parcel');
    }
    finally {
        await session.endSession();
    }
};
const verifyParcelOtpFromDB = async (payload) => {
    const { parcel_id, otp } = payload;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const parcel = await parcel_model_1.Parcel.findById(parcel_id).session(session);
        if (!parcel) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found');
        }
        if (parcel.status !== parcel_interface_1.PARCEL_STATUS.ONGOING) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Parcel is not in ONGOING state');
        }
        await otp_services_1.OtpServices.verifyOtpFromDB({
            parcel_id: parcel._id.toString(),
            inputOtp: otp,
            purpose: 'PARCEL',
        });
        // Complete the parcel automatically after OTP verification
        parcel.status = parcel_interface_1.PARCEL_STATUS.COMPLETED;
        parcel.completed_at = new Date();
        await parcel.save({ session });
        await session.commitTransaction();
        // Send notification after parcel is completed
        try {
            const driverUser = await user_model_1.default.findById(parcel.accepted_by);
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: parcel.user_id,
                type: notification_constant_1.NOTIFICATION_TYPE.PARCEL_COMPLETED,
                title: 'Parcel Delivered',
                message: `Your parcel "${parcel.parcel_name}" has been delivered successfully by ${driverUser?.full_name || 'the driver'}.`,
                parcel_id: parcel._id,
                data: {
                    parcel_name: parcel.parcel_name,
                    driver_id: parcel.accepted_by?.toString(),
                },
            });
        }
        catch (error) {
            console.error('Failed to create notification:', error);
        }
        return {
            message: 'Parcel OTP verified and completed successfully',
            parcel_id: parcel._id,
            status: parcel.status,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, error.message || 'Failed to verify OTP');
    }
    finally {
        await session.endSession();
    }
};
// const completeParcelFromDB = async (parcel_id: string, driver_id: string) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const parcel = await Parcel.findById(parcel_id).session(session);
//     if (!parcel) {
//       throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
//     }
//     if (parcel.status !== PARCEL_STATUS.ONGOING) {
//       throw new AppError(
//         httpStatus.BAD_REQUEST,
//         'Only ongoing parcels can be completed'
//       );
//     }
//     if (parcel.accepted_by?.toString() !== driver_id) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'You are not authorized to complete this parcel'
//       );
//     }
//     const otpUsed = await Otp.findOne({
//       parcel: parcel._id,
//       purpose: 'PARCEL',
//       is_used: true,
//     }).session(session);
//     if (!otpUsed) {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Parcel OTP not verified yet');
//     }
//     parcel.status = PARCEL_STATUS.COMPLETED;
//     parcel.completed_at = new Date();
//     await parcel.save({ session });
//     await session.commitTransaction();
//     try {
//       await NotificationServices.createNotificationIntoDB({
//         user_id: parcel.user_id,
//         type: NOTIFICATION_TYPE.PARCEL_COMPLETED,
//         title: 'Parcel Delivered',
//         message: `Your parcel "${parcel.parcel_name}" has been delivered successfully!`,
//         parcel_id: parcel._id,
//         data: {
//           parcel_name: parcel.parcel_name,
//         },
//       });
//     } catch (error) {
//       console.error('Failed to create notification:', error);
//     }
//     await session.endSession();
//     return {
//       message: 'Parcel completed successfully',
//       parcel_id: parcel._id,
//       status: parcel.status,
//     };
//   } catch (error: any) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       error.message || 'Failed to complete parcel'
//     );
//   }
// };
exports.DriverServices = {
    addDriverInfoIntoDB,
    updateDriverInfoInDB,
    getAllDriversFromDB,
    getSingleDriverFromDB,
    acceptParcelFromDB,
    verifyParcelOtpFromDB,
    getAvailableParcelsFromDB,
};
//# sourceMappingURL=driver.service.js.map
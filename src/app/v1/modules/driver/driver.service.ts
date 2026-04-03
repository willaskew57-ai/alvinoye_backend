import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { Driver } from './driver.model';
import QueryBuilder from '../../../../builders/query-builder';
import type { TDriver } from './driver.interface';
import mongoose, { Types } from 'mongoose';
import type { TVehicle } from '../vehicle/vehicle.interface';
import { Vehicle } from '../vehicle/vehicle.model';
import User from '../user/user.model';
import { Parcel } from '../parcel/parcel.model';
import { PARCEL_STATUS, PRICE_STATUS } from '../parcel/parcel.interface';
import { OtpServices } from '../otp/otp.services';
import { EmailHelpers } from '../../../../utils/email-helper';
import { sendSms } from '../../../../utils/send-sms';
import { deleteFileFromS3 } from '../../../../aws/deleteFromS3';
import configs from '../../../../config/env.config';
import axios from 'axios';
import { NotificationServices } from '../notification/notification.service';
import { NOTIFICATION_TYPE } from '../notification/notification.constant';

const addDriverInfoIntoDB = async (
  payload: { driverInfo: TDriver; vehicle: TVehicle },
  userIdFromToken: string
) => {
  const { driverInfo, vehicle } = payload;
  const finalUserId = driverInfo.user_id || userIdFromToken;

  if (!finalUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required!');
  }

  const isDriverExists = await Driver.findOne({ user_id: finalUserId });
  if (isDriverExists) {
    throw new AppError(httpStatus.CONFLICT, 'Driver profile already exists!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const driverData = { ...driverInfo, user_id: finalUserId };
    const newDriver = await Driver.create([driverData], { session });

    const vehicleData: TVehicle = {
      ...vehicle,
      user_id: finalUserId as any,
    };
    const newVehicle = await Vehicle.create([vehicleData], { session });

    const updatedUser = await User.findByIdAndUpdate(
      finalUserId,
      { is_profile_completed: true, status: 'ACTIVE' },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    await session.commitTransaction();

    return {
      driver: newDriver[0],
      vehicle: newVehicle[0],
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Registration failed'
    );
  } finally {
    await session.endSession();
  }
};

const updateDriverInfoInDB = async (
  userId: string,
  payload: { driverInfo?: Partial<TDriver>; vehicle?: any }
) => {
  const { driverInfo, vehicle } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (driverInfo) {
      const existingDriver = await Driver.findOne({ user_id: userId });
      if (driverInfo.license_image && existingDriver?.license_image) {
        deleteFileFromS3(existingDriver.license_image);
      }
      await Driver.findOneAndUpdate({ user_id: userId }, driverInfo, {
        session,
      });
    }

    if (vehicle) {
      const existingVehicle = await Vehicle.findOne({ user_id: userId });
      if (!existingVehicle) throw new Error('Vehicle not found');

      let finalImages = existingVehicle.vehicle_images || [];

      if (vehicle.existing_vehicle_images) {
        const toDelete = existingVehicle.vehicle_images.filter(
          (img: string) => !vehicle.existing_vehicle_images.includes(img)
        );
        toDelete.forEach((img: string) => deleteFileFromS3(img));
        finalImages = vehicle.existing_vehicle_images;
      }

      if (vehicle.vehicle_images) {
        finalImages = [...finalImages, ...vehicle.vehicle_images];
      }

      if (vehicle.number_plate_image && existingVehicle.number_plate_image) {
        deleteFileFromS3(existingVehicle.number_plate_image);
      }

      const vehicleData = { ...vehicle, vehicle_images: finalImages };
      delete vehicleData.existing_vehicle_images;

      await Vehicle.findOneAndUpdate({ user_id: userId }, vehicleData, {
        session,
      });
    }

    await session.commitTransaction();
    return await Driver.findOne({ user_id: userId }).populate('vehicle');
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

const getAllDriversFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };
  const search = query?.search as string;

  let driverIdsFromLocation: string[] | null = null;
  let driverIdsFromLicenseSearch: string[] | null = null;
  let vehicleMatchingUserIds: string[] | null = null;

  if (query?.from || query?.to) {
    const locConditions: any = {};
    if (query.from) {
      locConditions['from.address'] = {
        $regex: query.from as string,
        $options: 'i',
      };
    }
    if (query.to) {
      locConditions['to.address'] = {
        $regex: query.to as string,
        $options: 'i',
      };
    }

    const drivers = await Driver.find(locConditions).select('user_id');
    driverIdsFromLocation = drivers.map((d) => d.user_id.toString());
  }

  if (search) {
    const drivers = await Driver.find({
      driver_license_number: { $regex: search, $options: 'i' },
    }).select('user_id');
    driverIdsFromLicenseSearch = drivers.map((d) => d.user_id.toString());
  }

  if (query?.vehicle_type) {
    const vehicles = await Vehicle.find({
      vehicle_type: query.vehicle_type as string,
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

  const userQuery = new QueryBuilder(
    User.find({ role: 'DRIVER', is_profile_completed: true })
      .populate('driver_info')
      .populate('vehicle'),
    queryObj
  );

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

const getSingleDriverFromDB = async (id: string) => {
  const result = await User.findOne({ _id: id, role: 'DRIVER' })
    .populate('driver_info')
    .populate('vehicle');

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver not found!');
  }

  return result;
};

// Haversine formula to calculate distance in km between two coordinates
const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const DISTANCE_TO_ROUTE_BUFFER = 500;
const DEFAULT_DIRECTION_ANGLE_THRESHOLD = 90;

const calculateDistanceToRouteLine = (
  pointLat: number,
  pointLng: number,
  routeFromLat: number,
  routeFromLng: number,
  routeToLat: number,
  routeToLng: number
): number => {
  const distToStart = haversineDistanceKm(
    pointLat,
    pointLng,
    routeFromLat,
    routeFromLng
  );
  const distToEnd = haversineDistanceKm(
    pointLat,
    pointLng,
    routeToLat,
    routeToLng
  );
  const routeLength = haversineDistanceKm(
    routeFromLat,
    routeFromLng,
    routeToLat,
    routeToLng
  );

  if (routeLength === 0) return distToStart;

  if (distToStart + distToEnd <= routeLength + 0.1) {
    const s = (distToStart + distToEnd - routeLength) / 2;
    const h = Math.max(0, distToStart * distToStart - s * s);
    return Math.sqrt(h);
  }

  return Math.min(distToStart, distToEnd);
};

const calculateDirectionAngle = (
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number => {
  const dLng = toLng - fromLng;
  const dLat = toLat - fromLat;
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
};

const calculateAngleDifference = (angle1: number, angle2: number): number => {
  let diff = Math.abs(angle1 - angle2);
  if (diff > 180) diff = 360 - diff;
  return diff;
};

const MAX_DETOUR_CALCULATION = 20;
const ROUTE_BUFFER_KM = 0.5;
const DIRECTION_ANGLE_THRESHOLD = 90;

const getAvailableParcelsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentLat = Number(query.currentLat);
  const currentLng = Number(query.currentLng);

  if (isNaN(currentLat)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid currentLat');
  }
  if (isNaN(currentLng)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid currentLng');
  }

  const heading = query.heading ? Number(query.heading) : undefined;
  const radiusMeters = Number(query.radiusMeters) || 1500;

  const driver = await Driver.findOne({ user_id: userId });
  const vehicle = await Vehicle.findOne({ user_id: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver profile not found!');
  }
  if (!vehicle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vehicle profile not found!');
  }

  const savedRouteFromLat = driver.from?.latitude ?? 0;
  const savedRouteFromLng = driver.from?.longitude ?? 0;
  const savedRouteToLat = driver.to?.latitude ?? 0;
  const savedRouteToLng = driver.to?.longitude ?? 0;

  const distanceToSavedRoute = calculateDistanceToRouteLine(
    currentLat,
    currentLng,
    savedRouteFromLat ?? 0,
    savedRouteFromLng ?? 0,
    savedRouteToLat ?? 0,
    savedRouteToLng ?? 0
  );

  let isOnRoute = distanceToSavedRoute <= ROUTE_BUFFER_KM;

  if (
    heading !== undefined &&
    savedRouteToLat != null &&
    savedRouteToLng != null
  ) {
    const routeDirection = calculateDirectionAngle(
      currentLat,
      currentLng,
      savedRouteToLat,
      savedRouteToLng
    );
    const angleDifference = calculateAngleDifference(heading, routeDirection);
    if (angleDifference > DIRECTION_ANGLE_THRESHOLD) {
      isOnRoute = false;
    }
  }

  const discoveryMode = isOnRoute ? 'route-based' : 'nearby-fallback';

  const geoQuery = {
    status: PARCEL_STATUS.PENDING,
    vehicle_type: vehicle.vehicle_type,
    price_status: PRICE_STATUS.ACCEPTED,
    accepted_by: null,
    pickup_location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [currentLng, currentLat],
        },
        $maxDistance: radiusMeters,
      },
    },
  };

  let potentialParcels = await Parcel.find(geoQuery)
    .limit(limit * 3)
    .lean();

  if (!potentialParcels || potentialParcels.length === 0) {
    return {
      meta: { total: 0, page, limit, totalPages: 0, discoveryMode },
      data: [],
    };
  }

  const scoredParcels = potentialParcels.map((parcel) => {
    const pickupLoc = parcel.pickup_location;
    const dropoffLoc = parcel.handover_location;

    const distanceToPickup = haversineDistanceKm(
      currentLat,
      currentLng,
      pickupLoc?.latitude ?? 0,
      pickupLoc?.longitude ?? 0
    );
    const distanceToDropoff = haversineDistanceKm(
      currentLat,
      currentLng,
      dropoffLoc?.latitude ?? 0,
      dropoffLoc?.longitude ?? 0
    );

    let ahead = true;
    let inRouteScore = 0;
    let distanceToRoute = distanceToPickup;

    if (isOnRoute && savedRouteToLat != null && savedRouteToLng != null) {
      const totalTripDist = haversineDistanceKm(
        currentLat,
        currentLng,
        savedRouteToLat,
        savedRouteToLng
      );
      const pickupAlongRoute = haversineDistanceKm(
        currentLat,
        currentLng,
        pickupLoc?.latitude ?? 0,
        pickupLoc?.longitude ?? 0
      );

      ahead = pickupAlongRoute <= totalTripDist * 1.2 && pickupAlongRoute > 0;
      inRouteScore =
        totalTripDist > 0
          ? 1 -
            Math.min(
              1,
              (pickupAlongRoute + distanceToDropoff) / (totalTripDist * 2)
            )
          : 0;
      distanceToRoute = Math.min(distanceToPickup, distanceToDropoff);
    }

    return {
      _id: parcel._id,
      pickup_location: pickupLoc,
      dropoff_location: dropoffLoc,
      size: parcel.size,
      reward: parcel.final_price,
      distanceToPickup: Math.round(distanceToPickup * 1000),
      distanceToDropoff: Math.round(distanceToDropoff * 1000),
      distanceToRoute: Math.round(distanceToRoute * 1000),
      inRouteScore: Math.round(inRouteScore * 100) / 100,
      ahead,
    };
  });

  const sortedParcels = scoredParcels
    .sort((a, b) => {
      if (isOnRoute) {
        if (a.ahead !== b.ahead) return a.ahead ? -1 : 1;
        if (Math.abs(a.distanceToRoute - b.distanceToRoute) > 1) {
          return a.distanceToRoute - b.distanceToRoute;
        }
        return (b.inRouteScore || 0) - (a.inRouteScore || 0);
      } else {
        if (Math.abs(a.distanceToPickup - b.distanceToPickup) > 1) {
          return a.distanceToPickup - b.distanceToPickup;
        }
        return (b.reward || 0) - (a.reward || 0);
      }
    })
    .slice(0, limit);

  const apiKey = configs.google_maps_api_key;
  const allMatchedParcels: any[] = [];

  const driverOrigin = `${currentLat},${currentLng}`;
  const driverDestination =
    savedRouteToLat != null && savedRouteToLng != null
      ? `${savedRouteToLat},${savedRouteToLng}`
      : null;

  let originalDistance = 0;
  let baselineAvailable = false;
  const topNForDetour = sortedParcels.slice(0, MAX_DETOUR_CALCULATION);

  if (driverDestination && apiKey && isOnRoute) {
    try {
      const originalRouteRes = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&key=${apiKey}`
      );
      if (originalRouteRes.data.status === 'OK') {
        originalDistance =
          originalRouteRes.data.routes[0].legs[0].distance.value;
        baselineAvailable = true;
      }
    } catch (error) {
      console.error('Failed to get baseline distance', error);
    }
  }

  const DETOUR_THRESHOLD_KM = 20;

  for (const parcel of sortedParcels) {
    if (!isOnRoute || !driverDestination || !apiKey || !baselineAvailable) {
      allMatchedParcels.push({
        id: parcel._id,
        pickup_location: parcel.pickup_location,
        dropoff_location: parcel.dropoff_location,
        size: parcel.size,
        reward: parcel.reward,
        distanceToRoute: parcel.distanceToRoute,
        inRouteScore: parcel.inRouteScore,
        ahead: parcel.ahead,
        discoveryMode,
      });
      continue;
    }

    const pickup = parcel.pickup_location;
    const handover = parcel.dropoff_location;

    if (
      !pickup?.latitude ||
      !pickup?.longitude ||
      !handover?.latitude ||
      !handover?.longitude
    ) {
      allMatchedParcels.push({
        id: parcel._id,
        pickup_location: parcel.pickup_location,
        dropoff_location: parcel.dropoff_location,
        size: parcel.size,
        reward: parcel.reward,
        distanceToRoute: parcel.distanceToRoute,
        inRouteScore: parcel.inRouteScore,
        ahead: parcel.ahead,
        discoveryMode,
      });
      continue;
    }

    try {
      const pickupCoord = `${pickup.latitude},${pickup.longitude}`;
      const handoverCoord = `${handover.latitude},${handover.longitude}`;

      const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLat},${currentLng}&destination=${savedRouteToLat},${savedRouteToLng}&waypoints=${pickupCoord}|${handoverCoord}&key=${apiKey}`;

      const response = await axios.get(googleUrl);

      if (response.data.status === 'OK') {
        const legs = response.data.routes[0].legs;
        const totalDistanceWithParcel = legs.reduce(
          (acc: number, leg: any) => acc + leg.distance.value,
          0
        );

        const detourKm = (totalDistanceWithParcel - originalDistance) / 1000;

        if (detourKm <= DETOUR_THRESHOLD_KM) {
          allMatchedParcels.push({
            id: parcel._id,
            pickup_location: parcel.pickup_location,
            dropoff_location: parcel.dropoff_location,
            size: parcel.size,
            reward: parcel.reward,
            distanceToRoute: parcel.distanceToRoute,
            inRouteScore: parcel.inRouteScore,
            ahead: parcel.ahead,
            detour_km: Math.round(detourKm * 10) / 10,
            discoveryMode,
          });
        }
      }
    } catch (error) {
      console.error('Error calculating route for parcel:', parcel._id);
      allMatchedParcels.push({
        id: parcel._id,
        pickup_location: parcel.pickup_location,
        dropoff_location: parcel.dropoff_location,
        size: parcel.size,
        reward: parcel.reward,
        distanceToRoute: parcel.distanceToRoute,
        inRouteScore: parcel.inRouteScore,
        ahead: parcel.ahead,
        discoveryMode,
      });
    }
  }

  const total = allMatchedParcels.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedData = allMatchedParcels.slice(skip, skip + limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
      discoveryMode,
      distanceToSavedRoute: Math.round(distanceToSavedRoute * 1000),
      isOnRoute,
    },
    data: paginatedData,
  };
};

const acceptParcelFromDB = async (
  parcelId: string,
  driverIdFromToken: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parcel = await Parcel.findById(parcelId).session(session);

    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }

    if (parcel.status !== PARCEL_STATUS.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Parcel is not available for acceptance'
      );
    }

    parcel.status = PARCEL_STATUS.ONGOING;
    parcel.accepted_by = new Types.ObjectId(driverIdFromToken);
    parcel.accepted_at = new Date();

    await parcel.save({ session });

    const parcelOwner = await User.findById(parcel.user_id).session(session);

    if (!parcelOwner) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel owner not found');
    }

    const otp = await OtpServices.generateAndSaveOtp({
      parcel_id: parcel._id,
      purpose: 'PARCEL',
    });

    console.log(otp);

    await EmailHelpers.sendParcelOtpEmail({
      email: parcelOwner.email,
      name: parcelOwner.full_name,
      verificationCode: otp,
    });

    await session.commitTransaction();

    // Send SMS to receiver with parcel OTP (after transaction commits)
    if (parcel.receiver_phone) {
      const smsMessage = `Your parcel "${parcel.parcel_name}" has been picked up. Your verification OTP is: ${otp}. Please share this OTP with the driver for delivery confirmation.`;
      try {
        const smsResult = await sendSms(parcel.receiver_phone, smsMessage);
        if (!smsResult.success) {
          console.error('Failed to send SMS to receiver:', smsResult.error);
        }
      } catch (smsError) {
        console.error('Error sending SMS to receiver:', smsError);
      }
    }

    try {
      const driverUser = await User.findById(driverIdFromToken);
      await NotificationServices.createNotificationIntoDB({
        user_id: parcel.user_id,
        type: NOTIFICATION_TYPE.PARCEL_ACCEPTED,
        title: 'Parcel Accepted',
        message: `Driver ${driverUser?.full_name || 'has'} accepted your parcel "${parcel.parcel_name}".`,
        parcel_id: parcel._id,
        data: {
          parcel_name: parcel.parcel_name,
          driver_id: driverIdFromToken,
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }

    return {
      message: 'Parcel accepted successfully',
      parcel_id: parcel._id,
      status: parcel.status,
    };
  } catch (error: any) {
    await session.abortTransaction();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to accept parcel'
    );
  } finally {
    await session.endSession();
  }
};

const verifyParcelOtpFromDB = async (payload: {
  parcel_id: string;
  otp: string;
}) => {
  const { parcel_id, otp } = payload;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const parcel = await Parcel.findById(parcel_id).session(session);

    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }

    if (parcel.status !== PARCEL_STATUS.ONGOING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Parcel is not in ONGOING state'
      );
    }

    await OtpServices.verifyOtpFromDB({
      parcel_id: parcel._id.toString(),
      inputOtp: otp,
      purpose: 'PARCEL',
    });

    // Complete the parcel automatically after OTP verification
    parcel.status = PARCEL_STATUS.COMPLETED;
    parcel.completed_at = new Date();
    await parcel.save({ session });

    await session.commitTransaction();

    // Send notification after parcel is completed
    try {
      const driverUser = await User.findById(parcel.accepted_by);
      await NotificationServices.createNotificationIntoDB({
        user_id: parcel.user_id,
        type: NOTIFICATION_TYPE.PARCEL_COMPLETED,
        title: 'Parcel Delivered',
        message: `Your parcel "${parcel.parcel_name}" has been delivered successfully by ${driverUser?.full_name || 'the driver'}.`,
        parcel_id: parcel._id,
        data: {
          parcel_name: parcel.parcel_name,
          driver_id: parcel.accepted_by?.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
    }

    return {
      message: 'Parcel OTP verified and completed successfully',
      parcel_id: parcel._id,
      status: parcel.status,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to verify OTP'
    );
  } finally {
    await session.endSession();
  }
};

const selectParcelFromDB = async (payload: {
  parcel_id: string;
  driverId: string;
  routeContext?: {
    fromLat: number;
    fromLng: number;
    toLat?: number;
    toLng?: number;
    routePolyline?: string;
  };
}) => {
  const { parcel_id, driverId, routeContext } = payload;

  const parcel = await Parcel.findById(parcel_id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  if (parcel.status !== PARCEL_STATUS.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Parcel is not available for selection'
    );
  }

  parcel.status = PARCEL_STATUS.ONGOING;
  parcel.accepted_by = new Types.ObjectId(driverId);
  parcel.accepted_at = new Date();
  await parcel.save();

  const pickupLocation = parcel.pickup_location;
  const dropoffLocation = parcel.handover_location;

  let routeInjectionPoints = null;

  if (routeContext) {
    routeInjectionPoints = {
      pickup: {
        location: pickupLocation,
        type: 'pickup',
      },
      dropoff: {
        location: dropoffLocation,
        type: 'dropoff',
      },
      originalRoute: {
        fromLat: routeContext.fromLat,
        fromLng: routeContext.fromLng,
        toLat: routeContext.toLat,
        toLng: routeContext.toLng,
      },
    };
  }

  return {
    parcel_id: parcel._id,
    status: parcel.status,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    routeInjectionPoints,
  };
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

export const DriverServices = {
  addDriverInfoIntoDB,
  updateDriverInfoInDB,
  getAllDriversFromDB,
  getSingleDriverFromDB,
  acceptParcelFromDB,
  verifyParcelOtpFromDB,
  getAvailableParcelsFromDB,
  selectParcelFromDB,
};

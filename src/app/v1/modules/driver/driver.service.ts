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

import { deleteFileFromS3 } from '../../../../aws/deleteFromS3';
import configs from '../../../../config/env.config';
import axios from 'axios';
import { NotificationServices } from '../notification/notification.service';
import { WalletServices } from '../wallet/wallet.service';
import { pushEmailJob } from '../../../queues/email.queue';
import { sendParcelOtpEmailJob } from '../../../jobs/email.job';
import { pushSmsJob } from '../../../queues/sms.queue';
import { sendSmsJob } from '../../../jobs/sms.job';
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
      { is_profile_completed: true },
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

const ROUTE_BUFFER_KM = 0.5;
const DIRECTION_ANGLE_THRESHOLD = 90;

const getAvailableParcelsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const heading = query.heading ? Number(query.heading) : undefined;
  const radiusMeters = Number(query.radiusMeters) || 1500;

  const driver = await Driver.findOne({ user_id: userId });
  const vehicle = await Vehicle.findOne({ user_id: userId });

  if (!driver || !vehicle) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Driver or Vehicle profile not found!'
    );
  }

  const savedRouteFromLat = driver.from?.latitude
    ? Number(driver.from.latitude)
    : 0;
  const savedRouteFromLng = driver.from?.longitude
    ? Number(driver.from.longitude)
    : 0;
  const savedRouteToLat = driver.to?.latitude ? Number(driver.to.latitude) : 0;
  const savedRouteToLng = driver.to?.longitude
    ? Number(driver.to.longitude)
    : 0;

  const queryLat = Number(query.currentLat);
  const queryLng = Number(query.currentLng);

  let currentLat: number;
  let currentLng: number;
  let locationSource: 'driver_input' | 'saved_from_location';

  if (!isNaN(queryLat) && !isNaN(queryLng)) {
    currentLat = queryLat;
    currentLng = queryLng;
    locationSource = 'driver_input';
  } else if (savedRouteFromLat && savedRouteFromLng) {
    currentLat = savedRouteFromLat;
    currentLng = savedRouteFromLng;
    locationSource = 'saved_from_location';
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Current coordinates or driver from location is required'
    );
  }

  // 1. Calculate if driver is currently on their saved route
  const distanceToSavedRoute = calculateDistanceToRouteLine(
    currentLat,
    currentLng,
    savedRouteFromLat,
    savedRouteFromLng,
    savedRouteToLat,
    savedRouteToLng
  );

  let isOnRoute = distanceToSavedRoute <= ROUTE_BUFFER_KM;

  // 2. Check heading/direction if available
  if (
    isOnRoute &&
    heading !== undefined &&
    savedRouteToLat &&
    savedRouteToLng
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

  // Helper function to fetch parcels with geo-query
  const fetchParcelsByLocation = async (
    lat: number,
    lng: number,
    maxDist: number
  ) => {
    const geoQuery = {
      status: PARCEL_STATUS.PENDING,
      vehicle_type: vehicle.vehicle_type,
      price_status: PRICE_STATUS.ACCEPTED,
      accepted_by: null,
      is_paid: true,
      'pickup_location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDist,
        },
      },
    };

    return Parcel.find(geoQuery)
      .limit(limit * 5)
      .lean();
  };

  // Helper function to fetch parcels along the route (using from/to coordinates as bounds)
  const fetchParcelsAlongRoute = async () => {
    const minLat = Math.min(savedRouteFromLat, savedRouteToLat) - 0.05;
    const maxLat = Math.max(savedRouteFromLat, savedRouteToLat) + 0.05;
    const minLng = Math.min(savedRouteFromLng, savedRouteToLng) - 0.05;
    const maxLng = Math.max(savedRouteFromLng, savedRouteToLng) + 0.05;

    const routeQuery = {
      status: PARCEL_STATUS.PENDING,
      vehicle_type: vehicle.vehicle_type,
      price_status: PRICE_STATUS.ACCEPTED,
      accepted_by: null,
      is_paid: true,
      'pickup_location.latitude': { $gte: minLat, $lte: maxLat },
      'pickup_location.longitude': { $gte: minLng, $lte: maxLng },
    };

    return Parcel.find(routeQuery)
      .limit(limit * 5)
      .lean();
  };

  // Helper function to score a parcel
  const scoreParcel = (
    parcel: any,
    lat: number,
    lng: number,
    onRoute: boolean
  ) => {
    const pickupLoc = parcel.pickup_location;
    const dropoffLoc = parcel.handover_location;

    const distanceToPickup = haversineDistanceKm(
      lat,
      lng,
      pickupLoc.latitude,
      pickupLoc.longitude
    );
    const distanceToDropoff = haversineDistanceKm(
      lat,
      lng,
      dropoffLoc.latitude,
      dropoffLoc.longitude
    );

    const parcelActualDistance =
      savedRouteToLat && savedRouteToLng
        ? haversineDistanceKm(
            savedRouteFromLat,
            savedRouteFromLng,
            pickupLoc.latitude,
            pickupLoc.longitude
          )
        : 0;

    let ahead = true;
    let inRouteScore = 0;
    let distanceToRoute = distanceToPickup;

    if (onRoute && savedRouteToLat && savedRouteToLng) {
      const totalTripDist = haversineDistanceKm(
        lat,
        lng,
        savedRouteToLat,
        savedRouteToLng
      );
      const pickupAlongRoute = haversineDistanceKm(
        lat,
        lng,
        pickupLoc.latitude,
        pickupLoc.longitude
      );

      ahead = pickupAlongRoute <= totalTripDist * 1.2;
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
      ...parcel,
      distance_info: {
        parcel_actual_distance: `${parcelActualDistance.toFixed(1)} km`,
      },
    };
  };

  let potentialParcels: any[] = [];

  // Always fetch route parcels when using saved from location (driver starting journey)
  const isUsingSavedLocation = locationSource === 'saved_from_location';

  if (isOnRoute && !isUsingSavedLocation) {
    // Driver is on route and provided coordinates - use nearby query from current position
    potentialParcels = await fetchParcelsByLocation(
      currentLat,
      currentLng,
      radiusMeters
    );
  } else {
    // Driver is OFF route OR using saved from location - fetch BOTH route-based and nearby parcels
    const [routeParcels, nearbyParcels] = await Promise.all([
      fetchParcelsAlongRoute(),
      fetchParcelsByLocation(currentLat, currentLng, radiusMeters),
    ]);

    // Combine and deduplicate by _id
    const parcelMap = new Map<string, any>();

    for (const parcel of routeParcels) {
      const scored = scoreParcel(parcel, currentLat, currentLng, true);
      parcelMap.set(parcel._id.toString(), { ...scored, source: 'route' });
    }

    for (const parcel of nearbyParcels) {
      if (!parcelMap.has(parcel._id.toString())) {
        const scored = scoreParcel(parcel, currentLat, currentLng, false);
        parcelMap.set(parcel._id.toString(), { ...scored, source: 'nearby' });
      }
    }

    const combinedParcels = Array.from(parcelMap.values());

    if (combinedParcels.length === 0) {
      return {
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          discoveryMode: isUsingSavedLocation ? 'combined' : discoveryMode,
          isOnRoute,
          locationSource,
          distanceToSavedRoute: Math.round(distanceToSavedRoute * 1000),
        },
        data: [],
      };
    }

    // Sort combined parcels
    const sortedCombined = combinedParcels.sort((a: any, b: any) => {
      // Prioritize route parcels
      if (a.source !== b.source) {
        return a.source === 'route' ? -1 : 1;
      }
      const aDist = a.distance_info?.parcel_actual_distance
        ? parseFloat(a.distance_info.parcel_actual_distance)
        : 0;
      const bDist = b.distance_info?.parcel_actual_distance
        ? parseFloat(b.distance_info.parcel_actual_distance)
        : 0;
      return aDist - bDist;
    });

    const total = sortedCombined.length;
    const paginatedData = sortedCombined.slice(skip, skip + limit);

    return {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        discoveryMode: 'combined',
        isOnRoute,
        locationSource,
        distanceToSavedRoute: Math.round(distanceToSavedRoute * 1000),
      },
      data: paginatedData,
    };
  }

  if (!potentialParcels || potentialParcels.length === 0) {
    return {
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
        discoveryMode,
        isOnRoute,
        locationSource,
      },
      data: [],
    };
  }

  // 4. Scoring and Filtering
  const scoredParcels = potentialParcels.map((parcel: any) => {
    return {
      ...scoreParcel(parcel, currentLat, currentLng, isOnRoute),
      source: 'nearby',
    };
  });

  // 5. Sorting by parcel_actual_distance
  const sortedParcels = scoredParcels.sort((a: any, b: any) => {
    const aDist = a.distance_info?.parcel_actual_distance
      ? parseFloat(a.distance_info.parcel_actual_distance)
      : 0;
    const bDist = b.distance_info?.parcel_actual_distance
      ? parseFloat(b.distance_info.parcel_actual_distance)
      : 0;
    return aDist - bDist;
  });

  // 6. Detour Calculation (Google Maps API)
  const apiKey = configs.google_maps_api_key;
  const allMatchedParcels: any[] = [];
  const driverOrigin = `${currentLat},${currentLng}`;
  const driverDestination =
    savedRouteToLat && savedRouteToLng
      ? `${savedRouteToLat},${savedRouteToLng}`
      : null;

  let originalDistance = 0;
  let baselineAvailable = false;

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
      allMatchedParcels.push({ ...parcel, discoveryMode });
      continue;
    }

    try {
      const pickupCoord = `${parcel.pickup_location.latitude},${parcel.pickup_location.longitude}`;
      const handoverCoord = `${parcel.dropoff_location.latitude},${parcel.dropoff_location.longitude}`;
      const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&waypoints=${pickupCoord}|${handoverCoord}&key=${apiKey}`;

      const response = await axios.get(googleUrl);

      if (response.data.status === 'OK') {
        const totalDistanceWithParcel = response.data.routes[0].legs.reduce(
          (acc: number, leg: any) => acc + leg.distance.value,
          0
        );
        const detourKm = (totalDistanceWithParcel - originalDistance) / 1000;

        if (detourKm <= DETOUR_THRESHOLD_KM) {
          allMatchedParcels.push({
            ...parcel,
            detour_km: Math.round(detourKm * 10) / 10,
            discoveryMode,
          });
        }
      }
    } catch (error) {
      allMatchedParcels.push({ ...parcel, discoveryMode });
    }
  }

  const total = scoredParcels.length;
  const paginatedData = scoredParcels.slice(skip, skip + limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
      // Give the driver a clear, specific reason instead of a generic error.
      if (parcel.status === PARCEL_STATUS.ONGOING) {
        if (parcel.accepted_by?.toString() === driverIdFromToken) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'You have already accepted this parcel'
          );
        }
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'This parcel has already been accepted by another driver'
        );
      }

      if (parcel.status === PARCEL_STATUS.COMPLETED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'This parcel has already been delivered'
        );
      }

      if (parcel.status === PARCEL_STATUS.REJECTED) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'This parcel has been rejected and is no longer available'
        );
      }

      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Parcel is not available for acceptance'
      );
    }

    if (!parcel.is_paid) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Parcel has not been paid for yet'
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

    // Queue email to parcel owner
    await pushEmailJob(
      () =>
        sendParcelOtpEmailJob(parcelOwner.email, {
          email: parcelOwner.email,
          name: parcelOwner.full_name,
          verificationCode: otp,
        }),
      parcelOwner.email
    );

    await session.commitTransaction();

    // Send SMS to receiver with parcel OTP (queued, after transaction commits)
    if (parcel.receiver_phone) {
      const smsMessage = `Your parcel "${parcel.parcel_name}" has been picked up. Your verification OTP is: ${otp}. Please share this OTP with the driver for delivery confirmation.`;
      try {
        await pushSmsJob(
          () => sendSmsJob({ to: parcel.receiver_phone, body: smsMessage }),
          parcel.receiver_phone
        );
      } catch (error) {
        console.error('Failed to queue SMS to receiver:', error);
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

    console.log('Parcel accepted successfully', parcel);

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

    // Credit the driver's earning (final_price minus company commission) into
    // their wallet's PENDING balance, atomically with completion.
    let earning: { net: number; commissionAmount: number } | null = null;
    if (parcel.accepted_by && parcel.final_price) {
      earning = await WalletServices.creditEarning(
        {
          driverUserId: parcel.accepted_by,
          parcelId: parcel._id,
          grossAmount: parcel.final_price,
        },
        session
      );
    }

    await session.commitTransaction();

    // Notify the driver that earnings were added (after commit).
    if (earning && parcel.accepted_by) {
      try {
        await NotificationServices.createNotificationIntoDB({
          user_id: parcel.accepted_by,
          type: NOTIFICATION_TYPE.WALLET_CREDITED,
          title: 'Earnings Added',
          message: `You earned ${earning.net} for delivering "${parcel.parcel_name}". It will be available for withdrawal after the weekly distribution.`,
          parcel_id: parcel._id,
          data: {
            parcel_name: parcel.parcel_name,
            net: earning.net,
            commission: earning.commissionAmount,
          },
        });
      } catch (error) {
        console.error('Failed to create wallet notification:', error);
      }
    }

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

const resendParcelOtpFromDB = async (payload: {
  parcel_id: string;
  driverIdFromToken: string;
}) => {
  const { parcel_id, driverIdFromToken } = payload;

  const parcel = await Parcel.findById(parcel_id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  // OTP only makes sense while the parcel is out for delivery (accepted).
  if (parcel.status !== PARCEL_STATUS.ONGOING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'OTP can only be resent for an ongoing (accepted) parcel'
    );
  }

  // Only the driver who accepted this parcel may resend its OTP.
  if (parcel.accepted_by?.toString() !== driverIdFromToken) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You are not the driver assigned to this parcel'
    );
  }

  const parcelOwner = await User.findById(parcel.user_id);

  if (!parcelOwner) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel owner not found');
  }

  // Generate a fresh OTP. generateAndSaveOtp deletes any previous unused OTP
  // for this parcel first, so only the latest code stays valid.
  const otp = await OtpServices.generateAndSaveOtp({
    parcel_id: parcel._id,
    purpose: 'PARCEL',
  });

  console.log('[resend-otp]', otp);

  // Queue email to parcel owner (customer who created the parcel)
  await pushEmailJob(
    () =>
      sendParcelOtpEmailJob(parcelOwner.email, {
        email: parcelOwner.email,
        name: parcelOwner.full_name,
        verificationCode: otp,
      }),
    parcelOwner.email
  );

  // Queue SMS to receiver with the new parcel OTP
  if (parcel.receiver_phone) {
    const smsMessage = `Your parcel "${parcel.parcel_name}" verification OTP is: ${otp}. Please share this OTP with the driver for delivery confirmation.`;
    try {
      await pushSmsJob(
        () => sendSmsJob({ to: parcel.receiver_phone, body: smsMessage }),
        parcel.receiver_phone
      );
    } catch (error) {
      console.error('Failed to queue resend SMS to receiver:', error);
    }
  }

  return {
    message: 'Parcel OTP resent successfully',
    parcel_id: parcel._id,
  };
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
  resendParcelOtpFromDB,
  getAvailableParcelsFromDB,
  selectParcelFromDB,
};

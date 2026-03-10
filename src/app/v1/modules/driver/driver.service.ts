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
import Otp from '../otp/otp.model';
import { EmailHelpers } from '../../../../utils/email-helper';
import { sendSms } from '../../../../utils/send-sms';
import { deleteLocalFile } from '../../../../utils/deleteFileHelper';
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
        deleteLocalFile(existingDriver.license_image);
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
        toDelete.forEach((img: string) => deleteLocalFile(img));
        finalImages = vehicle.existing_vehicle_images;
      }

      if (vehicle.vehicle_images) {
        finalImages = [...finalImages, ...vehicle.vehicle_images];
      }

      if (vehicle.number_plate_image && existingVehicle.number_plate_image) {
        deleteLocalFile(existingVehicle.number_plate_image);
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

const getAvailableParcelsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const driver = await Driver.findOne({ user_id: userId });
  const vehicle = await Vehicle.findOne({ user_id: userId });

  if (!driver) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver profile not found!');
  }
  if (!vehicle) {
    throw new AppError(httpStatus.NOT_FOUND, 'Vehicle profile not found!');
  }

  const potentialParcels = await Parcel.find({
    status: PARCEL_STATUS.PENDING,
    vehicle_type: vehicle.vehicle_type,
    price_status: PRICE_STATUS.ACCEPTED,
    accepted_by: null,
  }).lean();

  if (potentialParcels.length === 0) {
    return {
      meta: { total: 0, page, limit, totalPages: 0 },
      data: [],
    };
  }

  const apiKey = configs.google_maps_api_key;
  const allMatchedParcels = [];

  const driverOrigin = `${driver.from.latitude},${driver.from.longitude}`;
  const driverDestination = `${driver.to.latitude},${driver.to.longitude}`;

  let originalDistance = 0;
  try {
    const originalRouteRes = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&key=${apiKey}`
    );
    if (originalRouteRes.data.status === 'OK') {
      originalDistance = originalRouteRes.data.routes[0].legs[0].distance.value;
    }
  } catch (error) {
    console.error('Failed to get baseline distance', error);
  }

  for (const parcel of potentialParcels) {
    try {
      const pickup = `${parcel.pickup_location.latitude},${parcel.pickup_location.longitude}`;
      const handover = `${parcel.handover_location.latitude},${parcel.handover_location.longitude}`;

      const googleUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${driverOrigin}&destination=${driverDestination}&waypoints=${pickup}|${handover}&key=${apiKey}`;

      const response = await axios.get(googleUrl);

      if (response.data.status === 'OK') {
        const route = response.data.routes[0];
        const legs = route.legs;

        const totalDistanceWithParcel = legs.reduce(
          (acc: number, leg: any) => acc + leg.distance.value,
          0
        );

        const parcelDistanceText = legs[1].distance.text;
        const detourKm = (totalDistanceWithParcel - originalDistance) / 1000;
        const thresholdKm = 20;

        if (detourKm <= thresholdKm) {
          allMatchedParcels.push({
            ...parcel,
            distance_info: {
              parcel_actual_distance: parcelDistanceText,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error calculating route for parcel:', parcel._id);
      continue;
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
};

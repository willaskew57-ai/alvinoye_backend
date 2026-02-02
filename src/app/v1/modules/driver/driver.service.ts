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
import { PARCEL_STATUS } from '../parcel/parcel.interface';
import { OtpServices } from '../otp/otp.services';
import Otp from '../otp/otp.model';
import { EmailHelpers } from '../../../../utils/email-helper';
import { deleteLocalFile } from '../../../../utils/deleteFileHelper';

const addDriverInfoIntoDB = async (
  payload: { driverInfo: TDriver; vehicle: TVehicle },
  userIdFromToken: string
) => {
  const { driverInfo, vehicle } = payload;
  const finalUserId = driverInfo.user_id || userIdFromToken;

  if (!finalUserId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required!');
  }

  // 1. Check if Driver already exists
  const isDriverExists = await Driver.findOne({ user_id: finalUserId });
  if (isDriverExists) {
    throw new AppError(httpStatus.CONFLICT, 'Driver profile already exists!');
  }

  // 2. Create Driver
  const driverData = { ...driverInfo, user_id: finalUserId };
  const newDriver = await Driver.create(driverData); // Removed array wrapper []

  try {
    // 3. Create Vehicle
    const vehicleData: TVehicle = {
      ...vehicle,
      user_id: finalUserId as any,
    };
    const newVehicle = await Vehicle.create(vehicleData);

    // 4. Update User Status
    const updatedUser = await User.findByIdAndUpdate(
      finalUserId,
      { is_profile_completed: true, status: 'ACTIVE' },
      { new: true }
    );

    if (!updatedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return {
      driver: newDriver,
      vehicle: newVehicle,
    };
  } catch (error: any) {
    // Manually delete the driver if vehicle creation fails (Manual Rollback)
    await Driver.findByIdAndDelete(newDriver._id);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Registration failed'
    );
  }
};

const updateDriverInfoInDB = async (
  userId: string,
  payload: { driverInfo?: Partial<TDriver>; vehicle?: any }
) => {
  const { driverInfo, vehicle } = payload;
  // const session = await mongoose.startSession();

  try {
    // session.startTransaction();

    if (driverInfo) {
      const existingDriver = await Driver.findOne({ user_id: userId });
      if (driverInfo.license_image && existingDriver?.license_image) {
        deleteLocalFile(existingDriver.license_image);
      }
      await Driver.findOneAndUpdate({ user_id: userId }, driverInfo);
    }

    if (vehicle) {
      const existingVehicle = await Vehicle.findOne({ user_id: userId });
      if (!existingVehicle) throw new Error('Vehicle not found');

      let finalImages = existingVehicle.vehicle_images || [];

      // Logic to delete images removed by user
      if (vehicle.existing_vehicle_images) {
        const toDelete = existingVehicle.vehicle_images.filter(
          (img: string) => !vehicle.existing_vehicle_images.includes(img)
        );
        toDelete.forEach((img: string) => deleteLocalFile(img));
        finalImages = vehicle.existing_vehicle_images;
      }

      // Add new uploaded images
      if (vehicle.vehicle_images) {
        finalImages = [...finalImages, ...vehicle.vehicle_images];
      }

      if (vehicle.number_plate_image && existingVehicle.number_plate_image) {
        deleteLocalFile(existingVehicle.number_plate_image);
      }

      const vehicleData = { ...vehicle, vehicle_images: finalImages };
      delete vehicleData.existing_vehicle_images;

      await Vehicle.findOneAndUpdate({ user_id: userId }, vehicleData );
    }

    // await session.commitTransaction();
    return await Driver.findOne({ user_id: userId }).populate('vehicle');
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // await session.endSession();
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
    .populate('driver_info') // This matches the key in your JSON
    .populate('vehicle'); // This matches the key in your JSON

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Driver not found!');
  }

  return result;
};

const acceptParcelFromDB = async (
  parcelId: string,
  driverIdFromToken: string
) => {
  // const session = await mongoose.startSession();

  try {
    // session.startTransaction();

    const parcel = await Parcel.findById(parcelId);

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

    await parcel.save();

    const parcelOwner = await User.findById(parcel.user_id);

    if (!parcelOwner) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel owner not found');
    }

    const otp = await OtpServices.generateAndSaveOtp({
      parcel_id: parcel._id,
      purpose: 'PARCEL',
    });

    console.log(otp)

    await EmailHelpers.sendParcelOtpEmail({
      email: parcelOwner.email,
      name: parcelOwner.full_name,
      verificationCode: otp,
    });

    // await session.commitTransaction();
    // await session.endSession();

    return {
      message: 'Parcel accepted successfully',
      parcel_id: parcel._id,
      status: parcel.status,
    };
  } catch (error: any) {
    // await session.abortTransaction();
    // await session.endSession();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to accept parcel'
    );
  }
};

const verifyParcelOtpFromDB = async (payload: {
  parcel_id: string;
  otp: string;
}) => {
  const { parcel_id, otp } = payload;

  const parcel = await Parcel.findById(parcel_id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  }

  if (parcel.status !== PARCEL_STATUS.ONGOING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Parcel is not in ONGOING state'
    );
  }

  // Verify OTP (no expiry for parcel)
  await OtpServices.verifyOtpFromDB({
    parcel_id: parcel._id.toString(),
    inputOtp: otp,
    purpose: 'PARCEL',
  });

  return {
    message: 'Parcel OTP verified successfully',
    parcel_id: parcel._id,
  };
};

const completeParcelFromDB = async (parcel_id: string, driver_id: string) => {
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
        'Only ongoing parcels can be completed'
      );
    }

    if (parcel.accepted_by?.toString() !== driver_id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to complete this parcel'
      );
    }

    const otpUsed = await Otp.findOne({
      parcel: parcel._id,
      purpose: 'PARCEL',
      is_used: true,
    }).session(session);

    if (!otpUsed) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Parcel OTP not verified yet');
    }

    parcel.status = PARCEL_STATUS.COMPLETED;
    parcel.completed_at = new Date();
    await parcel.save({ session });

    await session.commitTransaction();
    await session.endSession();

    return {
      message: 'Parcel completed successfully',
      parcel_id: parcel._id,
      status: parcel.status,
    };
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to complete parcel'
    );
  }
};

export const DriverServices = {
  addDriverInfoIntoDB,
  updateDriverInfoInDB,
  getAllDriversFromDB,
  getSingleDriverFromDB,
  acceptParcelFromDB,
  verifyParcelOtpFromDB,
  completeParcelFromDB,
};

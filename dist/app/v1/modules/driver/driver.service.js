import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { Driver } from './driver.model';
import QueryBuilder from '../../../../builders/query-builder';
import mongoose, { Types } from 'mongoose';
import { Vehicle } from '../vehicle/vehicle.model';
import User from '../user/user.model';
import { Parcel } from '../parcel/parcel.model';
import { PARCEL_STATUS } from '../parcel/parcel.interface';
import { OtpServices } from '../otp/otp.services';
import Otp from '../otp/otp.model';
import { EmailHelpers } from '../../../../utils/email-helper';
const addDriverInfoIntoDB = async (payload, userIdFromToken // Add this parameter
) => {
    const { driverInfo, vehicle } = payload;
    const finalUserId = driverInfo.user_id || userIdFromToken;
    if (!finalUserId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User ID is required!');
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const isDriverExists = await Driver.findOne({
            user_id: finalUserId,
        }).session(session);
        if (isDriverExists) {
            throw new AppError(httpStatus.CONFLICT, 'Driver profile already exists for this user!');
        }
        const driverData = { ...driverInfo, user_id: finalUserId };
        const newDriver = await Driver.create([driverData], { session });
        if (!newDriver.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create driver profile');
        }
        const vehicleData = {
            ...vehicle,
            user_id: finalUserId,
        };
        const newVehicle = await Vehicle.create([vehicleData], { session });
        if (!newVehicle.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create vehicle record');
        }
        const updatedUser = await User.findByIdAndUpdate(finalUserId, { is_profile_completed: true, status: 'ACTIVE' }, { session, new: true } // Must pass the session here!
        );
        if (!updatedUser) {
            throw new AppError(httpStatus.NOT_FOUND, 'User not found to update profile status');
        }
        await session.commitTransaction();
        await session.endSession();
        return {
            driver: newDriver[0],
            vehicle: newVehicle[0],
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message || 'Registration failed');
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
    const userQuery = new QueryBuilder(User.find({ role: 'DRIVER', is_profile_completed: true })
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
    const result = await User.findOne({ _id: id, role: 'DRIVER' })
        .populate('driver_info') // This matches the key in your JSON
        .populate('vehicle'); // This matches the key in your JSON
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Driver not found!');
    }
    return result;
};
const acceptParcelFromDB = async (parcelId, driverIdFromToken) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const parcel = await Parcel.findById(parcelId).session(session);
        if (!parcel) {
            throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
        }
        if (parcel.status !== PARCEL_STATUS.PENDING) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Parcel is not available for acceptance');
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
        await EmailHelpers.sendParcelOtpEmail({
            email: parcelOwner.email,
            name: parcelOwner.full_name,
            verificationCode: otp,
        });
        await session.commitTransaction();
        await session.endSession();
        return {
            message: 'Parcel accepted successfully',
            parcel_id: parcel._id,
            status: parcel.status,
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message || 'Failed to accept parcel');
    }
};
const verifyParcelOtpFromDB = async (payload) => {
    const { parcel_id, otp } = payload;
    const parcel = await Parcel.findById(parcel_id);
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
    }
    if (parcel.status !== PARCEL_STATUS.ONGOING) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Parcel is not in ONGOING state');
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
const completeParcelFromDB = async (parcel_id, driver_id) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const parcel = await Parcel.findById(parcel_id).session(session);
        if (!parcel) {
            throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
        }
        if (parcel.status !== PARCEL_STATUS.ONGOING) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Only ongoing parcels can be completed');
        }
        if (parcel.accepted_by?.toString() !== driver_id) {
            throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to complete this parcel');
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
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw new AppError(httpStatus.BAD_REQUEST, error.message || 'Failed to complete parcel');
    }
};
export const DriverServices = {
    addDriverInfoIntoDB,
    getAllDriversFromDB,
    getSingleDriverFromDB,
    acceptParcelFromDB,
    verifyParcelOtpFromDB,
    completeParcelFromDB,
};
//# sourceMappingURL=driver.service.js.map
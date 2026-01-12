import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { Driver } from './driver.model';
import QueryBuilder from '../../../../builders/QueryBuilder';
import mongoose from 'mongoose';
import { Vehicle } from '../vehicle/vehicle.model';
import User from '../user/user.model';
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
    // 1. Storage for cross-model matching IDs
    let driverIdsFromLocation = null;
    let driverIdsFromLicenseSearch = null;
    let vehicleMatchingUserIds = null;
    // 2. Handle Location Filters (Match against nested address objects)
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
    // 3. Handle License Search (For the global search bar)
    if (search) {
        const drivers = await Driver.find({
            driver_license_number: { $regex: search, $options: 'i' },
        }).select('user_id');
        driverIdsFromLicenseSearch = drivers.map((d) => d.user_id.toString());
    }
    // 4. Handle Vehicle Type Filter
    if (query?.vehicle_type) {
        const vehicles = await Vehicle.find({
            vehicle_type: query.vehicle_type,
        }).select('user_id');
        vehicleMatchingUserIds = vehicles.map((v) => v.user_id.toString());
    }
    // 5. Construct Main User Query (The Root)
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
    const userQuery = new QueryBuilder(User.find({ role: 'DRIVER' })
        .populate('driver_info') // Ensure virtual/ref is set in User Schema
        .populate('vehicle'), // Ensure virtual/ref is set in User Schema
    queryObj);
    // 6. Apply Global Search logic: (Name OR Email OR License)
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
    // 7. Apply Strict "AND" Filters
    // If location was provided, the user MUST be in the matching ID list
    if (driverIdsFromLocation !== null) {
        userQuery.modelQuery = userQuery.modelQuery.find({
            _id: { $in: driverIdsFromLocation },
        });
    }
    // If vehicle type was provided, the user MUST be in the matching ID list
    if (vehicleMatchingUserIds !== null) {
        userQuery.modelQuery = userQuery.modelQuery.find({
            _id: { $in: vehicleMatchingUserIds },
        });
    }
    // Apply Status filter (Active/Blocked)
    if (query?.status) {
        userQuery.modelQuery = userQuery.modelQuery.find({ status: query.status });
    }
    // 8. Execute Pagination, Sorting, and Final Query
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
export const DriverServices = {
    addDriverInfoIntoDB,
    getAllDriversFromDB,
    getSingleDriverFromDB,
};
//# sourceMappingURL=driver.service.js.map
import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { User } from './user.model';
import { USER_ROLE, USER_STATUS, } from './user.interface';
import { Types } from 'mongoose';
import QueryBuilder from '../../../../builders/query-builder';
import { deleteLocalFile } from '../../../../utils/deleteFileHelper';
import { Parcel } from '../parcel/parcel.model';
import { PARCEL_STATUS } from '../parcel/parcel.interface';
const createAdminIntoDB = async (payload) => {
    const isUserExists = await User.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, 'User with this email already exists!');
    }
    const userData = {
        ...payload,
        role: 'ADMIN',
        status: 'ACTIVE',
        is_profile_completed: true,
        is_verified: true,
    };
    const result = await User.create(userData);
    return result;
};
// ** ------------- User Status update Service -------------
const changeUserStatusInDB = async (targetId, payload, performerId, performerRole) => {
    const targetUser = await User.findById(targetId);
    if (!targetUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    if (performerRole === USER_ROLE.ADMIN) {
        const allowedRolesToManage = [USER_ROLE.CUSTOMER, USER_ROLE.DRIVER];
        if (!allowedRolesToManage.includes(targetUser.role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'Admins can only manage status for Customers and Drivers');
        }
    }
    if (targetUser.status === USER_STATUS.ACTIVE &&
        payload.status === USER_STATUS.PENDING) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot change status back to PENDING once a user is ACTIVE');
    }
    const updateData = {
        status: payload.status,
    };
    const adminObjectId = new Types.ObjectId(performerId);
    switch (payload.status) {
        case USER_STATUS.BLOCKED:
            updateData.blocked_by = adminObjectId;
            break;
        case USER_STATUS.ACTIVE:
            updateData.blocked_by = null;
            break;
    }
    const result = await User.findByIdAndUpdate(targetId, { $set: updateData }, { new: true, runValidators: true });
    return result;
};
const getAllUsersFromDB = async (query) => {
    const userSearchableFields = ['full_name', 'email', 'phone_number'];
    const baseQuery = User.find({
        role: { $in: [USER_ROLE.CUSTOMER, USER_ROLE.DRIVER] },
    });
    const userQuery = new QueryBuilder(baseQuery, query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return {
        meta,
        data,
    };
};
const getSingleUserFromDB = async (id) => {
    const result = await User.findOne({ _id: id });
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    return result;
};
const getMeFromDB = async (id) => {
    const result = await User.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    return result;
};
const updateMeIntoDB = async (id, payload) => {
    const forbiddenFields = [
        'role',
        'status',
        'email',
        'is_profile_completed',
    ];
    forbiddenFields.forEach((field) => {
        if (field in payload) {
            delete payload[field];
        }
    });
    if (payload.profile_picture) {
        const existingUser = await User.findById(id);
        if (existingUser && existingUser.profile_picture) {
            deleteLocalFile(existingUser.profile_picture);
        }
    }
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    return result;
};
const updateUserInDB = async (id, payload) => {
    const result = await User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    return result;
};
const deleteUserFromDB = async (id) => {
    const hasOngoingParcel = await Parcel.findOne({
        $or: [{ user_id: id }, { accepted_by: id }],
        status: PARCEL_STATUS.ONGOING,
    });
    if (hasOngoingParcel) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Cannot delete user. This account has an ongoing delivery in progress.');
    }
    const result = await User.findByIdAndUpdate(id, {
        status: 'DELETED',
        deleted_date: new Date(),
    }, { new: true });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }
    return result;
};
export const UserServices = {
    createAdminIntoDB,
    changeUserStatusInDB,
    getAllUsersFromDB,
    getMeFromDB,
    updateMeIntoDB,
    getSingleUserFromDB,
    updateUserInDB,
    deleteUserFromDB,
};
//# sourceMappingURL=user.service.js.map
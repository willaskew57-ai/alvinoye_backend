import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { User } from './user.model';
import { USER_ROLE, USER_STATUS, } from './user.interface';
import { Types } from 'mongoose';
import QueryBuilder from '../../../../builders/QueryBuilder';
const createUserIntoDB = async (payload) => {
    const isUserExists = await User.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, 'User with this email already exists!');
    }
    const userData = {
        ...payload,
        is_profile_completed: true,
        is_verified: true,
    };
    const result = await User.create(userData);
    return result;
};
// ** ------------- User Status update Service -------------
const changeUserStatusInDB = async (targetId, payload, performerId, performerRole // From req.user.role
) => {
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
        case USER_STATUS.REMOVED:
        case USER_STATUS.DELETED:
            updateData.removed_by = adminObjectId;
            updateData.deleted_date = new Date();
            break;
        case USER_STATUS.ACTIVE:
            updateData.blocked_by = null;
            updateData.removed_by = null;
            updateData.deleted_date = null;
            break;
    }
    const result = await User.findByIdAndUpdate(targetId, { $set: updateData }, { new: true, runValidators: true });
    return result;
};
const getAllUsersFromDB = async (query) => {
    // 1. Define the fields you want to enable for searching (full_name)
    const userSearchableFields = ['full_name', 'email', 'phone_number'];
    // 2. Initialize the QueryBuilder with the User model and the query object
    const userQuery = new QueryBuilder(User.find(), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    // 3. Execute the query to get the data
    const data = await userQuery.modelQuery;
    // 4. Get the pagination metadata
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
    const result = await User.findByIdAndUpdate(id, { is_deleted: true, deleted_date: new Date() }, { new: true });
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    return result;
};
export const UserServices = {
    createUserIntoDB,
    changeUserStatusInDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserInDB,
    deleteUserFromDB,
};
//# sourceMappingURL=user.service.js.map
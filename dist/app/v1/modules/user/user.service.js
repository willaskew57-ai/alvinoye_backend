"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const user_model_1 = require("./user.model");
const user_interface_1 = require("./user.interface");
const mongoose_1 = require("mongoose");
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const deleteFromS3_1 = require("../../../../aws/deleteFromS3");
const parcel_model_1 = require("../parcel/parcel.model");
const parcel_interface_1 = require("../parcel/parcel.interface");
const createAdminIntoDB = async (payload) => {
    const isUserExists = await user_model_1.User.isUserExistsByEmail(payload.email);
    if (isUserExists) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, 'User with this email already exists!');
    }
    const userData = {
        ...payload,
        role: 'ADMIN',
        status: 'ACTIVE',
        is_profile_completed: true,
        is_verified: true,
    };
    const result = await user_model_1.User.create(userData);
    return result;
};
// ** ------------- User Status update Service -------------
const changeUserStatusInDB = async (targetId, payload, performerId, performerRole) => {
    const targetUser = await user_model_1.User.findById(targetId);
    if (!targetUser) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (performerRole === user_interface_1.USER_ROLE.ADMIN) {
        const allowedRolesToManage = [user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER];
        if (!allowedRolesToManage.includes(targetUser.role)) {
            throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'Admins can only manage status for Customers and Drivers');
        }
    }
    if (targetUser.status === user_interface_1.USER_STATUS.ACTIVE &&
        payload.status === user_interface_1.USER_STATUS.PENDING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Cannot change status back to PENDING once a user is ACTIVE');
    }
    const updateData = {
        status: payload.status,
    };
    const adminObjectId = new mongoose_1.Types.ObjectId(performerId);
    switch (payload.status) {
        case user_interface_1.USER_STATUS.BLOCKED:
            updateData.blocked_by = adminObjectId;
            break;
        case user_interface_1.USER_STATUS.ACTIVE:
            updateData.blocked_by = null;
            break;
    }
    const result = await user_model_1.User.findByIdAndUpdate(targetId, { $set: updateData }, { new: true, runValidators: true });
    return result;
};
const getAllUsersFromDB = async (query) => {
    const userSearchableFields = ['full_name', 'email', 'phone_number'];
    const baseQuery = user_model_1.User.find({
        role: { $in: [user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER] },
    });
    const userQuery = new query_builder_1.default(baseQuery, query)
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
    const result = await user_model_1.User.findOne({ _id: id });
    if (!result)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    return result;
};
const getMeFromDB = async (id) => {
    const result = await user_model_1.User.findById(id);
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
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
        const existingUser = await user_model_1.User.findById(id);
        if (existingUser && existingUser.profile_picture) {
            (0, deleteFromS3_1.deleteFileFromS3)(existingUser.profile_picture);
        }
    }
    const result = await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return result;
};
const updateUserInDB = async (id, payload) => {
    const result = await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result)
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    return result;
};
const deleteUserFromDB = async (id) => {
    const hasOngoingParcel = await parcel_model_1.Parcel.findOne({
        $or: [{ user_id: id }, { accepted_by: id }],
        status: parcel_interface_1.PARCEL_STATUS.ONGOING,
    });
    if (hasOngoingParcel) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Cannot delete user. This account has an ongoing delivery in progress.');
    }
    const result = await user_model_1.User.findByIdAndUpdate(id, {
        status: 'DELETED',
        deleted_date: new Date(),
    }, { new: true });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    return result;
};
exports.UserServices = {
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
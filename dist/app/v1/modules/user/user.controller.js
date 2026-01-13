import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catchAsync';
import sendResponse from '../../../../utils/sendResponse';
import { UserServices } from './user.service';
const createUser = catchAsync(async (req, res) => {
    const result = await UserServices.createUserIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});
const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = id;
    const { status } = req.body;
    const performerId = req.user.userId;
    const performerRole = req.user.role;
    const result = await UserServices.changeUserStatusInDB(userId, { status }, performerId, performerRole);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});
const getMe = catchAsync(async (req, res) => {
    const { user_id } = req.user;
    console.log({ user: req.user });
    const result = await UserServices.getMeFromDB(user_id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
});
const updateMe = catchAsync(async (req, res) => {
    const { user_id } = req.user; // Extracted from token
    const result = await UserServices.updateMeIntoDB(user_id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});
const getAllUser = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUsersFromDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});
const getSingleUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUserFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
const updateUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await UserServices.updateUserInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});
const deleteUser = catchAsync(async (req, res) => {
    const id = req.params.id;
    await UserServices.deleteUserFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User deleted successfully',
        data: null,
    });
});
export const UserControllers = {
    createUser,
    changeStatus,
    getMe,
    updateMe,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.controller.js.map
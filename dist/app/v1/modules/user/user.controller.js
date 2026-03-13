"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const user_service_1 = require("./user.service");
const multer_s3_uploader_1 = require("../../../../aws/multer-s3-uploader");
const createAdmin = (0, catch_async_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.createAdminIntoDB(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'User created successfully',
        data: result,
    });
});
const changeStatus = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const userId = id;
    const { status } = req.body;
    const performerId = req.user.user_id;
    const performerRole = req.user.role;
    const result = await user_service_1.UserServices.changeUserStatusInDB(userId, { status }, performerId, performerRole);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User status updated successfully',
        data: result,
    });
});
const getMe = (0, catch_async_1.default)(async (req, res) => {
    const { user_id } = req.user;
    const result = await user_service_1.UserServices.getMeFromDB(user_id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
});
const updateMe = (0, catch_async_1.default)(async (req, res) => {
    // Use Express.Multer.File type instead of TCustomFile for local uploads
    const files = req.files;
    console.log(files, 'profile image file');
    if (files?.profile_image && files.profile_image.length > 0) {
        const file = files.profile_image[0];
        // file.key contains the S3 key (e.g., "uploads/profile_images/filename.jpg")
        // We transform this into a CloudFront URL
        req.body.profile_picture = (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key);
    }
    const { user_id } = req.user;
    const result = await user_service_1.UserServices.updateMeIntoDB(user_id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});
const getAllUser = (0, catch_async_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUsersFromDB(req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});
const getSingleUser = (0, catch_async_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserServices.getSingleUserFromDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
});
const updateUser = (0, catch_async_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_1.UserServices.updateUserInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully',
        data: result,
    });
});
const deleteUser = (0, catch_async_1.default)(async (req, res) => {
    const id = req.params.id;
    await user_service_1.UserServices.deleteUserFromDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User deleted successfully',
        data: null,
    });
});
exports.UserControllers = {
    createAdmin,
    changeStatus,
    getMe,
    updateMe,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.controller.js.map
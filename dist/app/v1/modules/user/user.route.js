"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_zod_validation_1 = require("./user.zod-validation");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const auth_1 = require("../../../../middleware/auth");
const user_interface_1 = require("./user.interface");
const multer_s3_uploader_1 = require("../../../../aws/multer-s3-uploader");
const router = express_1.default.Router();
// Only SUPER_ADMIN can create a user directly via this admin route
router.post('/create-admin', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(user_zod_validation_1.UserValidation.createAdminValidationSchema), user_controller_1.UserControllers.createAdmin);
router.patch('/change-status/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN), (0, validate_request_1.default)(user_zod_validation_1.UserValidation.changeStatusValidationSchema), user_controller_1.UserControllers.changeStatus);
router.get('/get-all', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), user_controller_1.UserControllers.getAllUser);
// --- Profile Routes ---
router.get('/get-me', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), user_controller_1.UserControllers.getMe);
router.patch('/update-me', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), (0, multer_s3_uploader_1.uploadFile)(), // Use AWS S3 uploader
(req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validate_request_1.default)(user_zod_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserControllers.updateMe);
router.get('/get-single/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), user_controller_1.UserControllers.getSingleUser);
router.patch('/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(user_zod_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserControllers.updateUser);
router.patch('/delete/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), user_controller_1.UserControllers.deleteUser);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map
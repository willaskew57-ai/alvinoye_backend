"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = require("express");
const settings_validation_1 = require("./settings.validation");
const auth_1 = require("../../../../middleware/auth"); // Assume this middleware exists
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const settings_controller_1 = require("./settings.controller");
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
//** ----------- FAQ Routes ------------
router.post('/faq/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.faqValidation.create), settings_controller_1.SettingsController.createFaq);
router.get('/faq/get-all', settings_controller_1.SettingsController.getFaqs);
router.patch('/faq/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.faqValidation.update), settings_controller_1.SettingsController.updateFaq);
router.get('/faq/get/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), settings_controller_1.SettingsController.getSingleFaqs);
router.delete('/faq/delete/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), settings_controller_1.SettingsController.deleteFaq);
// ** --------------- Terms Routes ----------
router.post('/terms/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentCreateValidation), settings_controller_1.SettingsController.createTerms);
router.get('/terms/get', settings_controller_1.SettingsController.getSingleTerms);
router.patch('/terms/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentUpdateValidation), settings_controller_1.SettingsController.updateTerms);
//** ---------------- Privacy Routes ---------
router.post('/privacy/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentCreateValidation), settings_controller_1.SettingsController.createPrivacy);
router.get('/privacy/get', settings_controller_1.SettingsController.getSinglePrivacy);
router.patch('/privacy/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentUpdateValidation), settings_controller_1.SettingsController.updatePrivacy);
//** ---------------- About Us Routes ---------
router.post('/about/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentCreateValidation), settings_controller_1.SettingsController.createAbout);
router.get('/about/get', settings_controller_1.SettingsController.getSingleAbout);
router.patch('/about/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(settings_validation_1.contentUpdateValidation), settings_controller_1.SettingsController.updateAbout);
exports.SettingsRoutes = router;
//# sourceMappingURL=settings.routes.js.map
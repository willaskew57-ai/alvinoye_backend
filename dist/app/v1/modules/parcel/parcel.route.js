"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../../middleware/auth");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const user_interface_1 = require("../user/user.interface");
const parcel_controller_1 = require("./parcel.controller");
const parcel_validation_1 = require("./parcel.validation");
const multer_s3_uploader_1 = require("../../../../aws/multer-s3-uploader");
const router = express_1.default.Router();
router.post('/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const files = req.files;
    if (files?.parcel_images) {
        req.body.parcel_images = files.parcel_images.map((file) => (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key));
    }
    next();
}, (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.createParcelValidationSchema), parcel_controller_1.ParcelControllers.createParcel);
router.patch('/update/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, multer_s3_uploader_1.uploadFile)(), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    const files = req.files;
    if (files?.parcel_images) {
        req.body.parcel_images = files.parcel_images.map((file) => (0, multer_s3_uploader_1.getCloudFrontUrl)(file.key));
    }
    next();
}, (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.updateParcelValidationSchema), parcel_controller_1.ParcelControllers.updateParcel);
router.get('/get-all', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), parcel_controller_1.ParcelControllers.getAllParcels);
router.get('/get-my-parcels', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), parcel_controller_1.ParcelControllers.getMyParcels);
router.get('/get/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.DRIVER, user_interface_1.USER_ROLE.CUSTOMER), parcel_controller_1.ParcelControllers.getSingleParcel);
router.patch('/reject/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN), (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.rejectParcelValidationSchema), parcel_controller_1.ParcelControllers.rejectParcel);
router.patch('/request-for-price/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), parcel_controller_1.ParcelControllers.requestForPrice);
// ** ------- Negotiation Flow -------
// Admin sets first price
router.post('/propose-price', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.createPriceRequestValidationSchema), parcel_controller_1.ParcelControllers.proposePrice);
// Customer Reject & Counter
router.patch('/reject-and-counter/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.customerRejectAndCounterValidationSchema), parcel_controller_1.ParcelControllers.rejectAndCounter);
// Admin Reject & Final Price
router.patch('/final-offer/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(parcel_validation_1.ParcelValidations.adminRejectAndFinalOfferValidationSchema), parcel_controller_1.ParcelControllers.adminFinalOffer);
// Simple Accept or Reject (Final choice)
router.patch('/accept-price/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.CUSTOMER), parcel_controller_1.ParcelControllers.acceptPrice);
router.patch('/reject-price/:id', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.CUSTOMER), parcel_controller_1.ParcelControllers.rejectPrice);
exports.ParcelRoutes = router;
//# sourceMappingURL=parcel.route.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const auth_1 = require("../../../../middleware/auth");
const review_validation_1 = require("./review.validation");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const user_interface_1 = require("../user/user.interface");
const router = (0, express_1.Router)();
router.post('/create', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), (0, validate_request_1.default)(review_validation_1.createReviewValidationSchema), review_controller_1.ReviewController.createReview);
router.get('/get/:id', (0, auth_1.auth)(), review_controller_1.ReviewController.getSingleReview);
router.get('/get-driver-review', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), review_controller_1.ReviewController.getDriverReviews);
router.get('/get-customer-review', (0, auth_1.auth)(user_interface_1.USER_ROLE.CUSTOMER), review_controller_1.ReviewController.getCustomerReviews);
exports.ReviewRoutes = router;
//# sourceMappingURL=review.routes.js.map
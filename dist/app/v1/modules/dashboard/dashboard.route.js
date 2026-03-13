"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
// route.ts
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../../middleware/auth");
const user_interface_1 = require("../user/user.interface");
const dashboard_controller_1 = require("./dashboard.controller");
const router = express_1.default.Router();
router.get('/stats', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), dashboard_controller_1.getDashboardStats);
router.get('/parcel-movement', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), dashboard_controller_1.getParcelMovementStats);
router.get('/parcel-owner-growth', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), dashboard_controller_1.getParcelOwnerGrowth);
exports.DashboardRoute = router;
//# sourceMappingURL=dashboard.route.js.map
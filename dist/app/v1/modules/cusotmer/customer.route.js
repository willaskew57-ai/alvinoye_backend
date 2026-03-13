"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("./customer.controller");
const auth_1 = require("../../../../middleware/auth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
router.get('/get-all', (0, auth_1.auth)(user_interface_1.USER_ROLE.SUPER_ADMIN, user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.CUSTOMER, user_interface_1.USER_ROLE.DRIVER), customer_controller_1.UserControllers.getAllCustomer);
exports.CustomerRoutes = router;
//# sourceMappingURL=customer.route.js.map
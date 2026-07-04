"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../../middleware/auth");
const validate_request_1 = __importDefault(require("../../../../middleware/validate-request"));
const user_interface_1 = require("../user/user.interface");
const wallet_controller_1 = require("./wallet.controller");
const wallet_validation_1 = require("./wallet.validation");
const router = express_1.default.Router();
// ** ---------- Driver ----------
router.get('/me', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), wallet_controller_1.WalletController.getMyWallet);
router.get('/transactions', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), wallet_controller_1.WalletController.getMyTransactions);
router.post('/withdraw', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), (0, validate_request_1.default)(wallet_validation_1.WalletValidation.withdrawSchema), wallet_controller_1.WalletController.withdraw);
router.get('/withdrawals', (0, auth_1.auth)(user_interface_1.USER_ROLE.DRIVER), wallet_controller_1.WalletController.getMyWithdrawals);
// ** ---------- Admin ----------
router.get('/admin/withdrawals', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), wallet_controller_1.WalletController.getAllWithdrawals);
router.patch('/admin/withdrawals/:id/retry', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), wallet_controller_1.WalletController.retryPayout);
router.get('/admin/commission', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), wallet_controller_1.WalletController.getCommission);
router.patch('/admin/commission', (0, auth_1.auth)(user_interface_1.USER_ROLE.ADMIN, user_interface_1.USER_ROLE.SUPER_ADMIN), (0, validate_request_1.default)(wallet_validation_1.WalletValidation.updateCommissionSchema), wallet_controller_1.WalletController.updateCommission);
exports.WalletRoutes = router;
//# sourceMappingURL=wallet.route.js.map
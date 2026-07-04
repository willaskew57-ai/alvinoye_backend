"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const wallet_service_1 = require("./wallet.service");
const getMyWallet = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.getMyWallet(req.user.user_id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Wallet retrieved successfully',
        data: result,
    });
});
const getMyTransactions = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.getMyTransactions(req.user.user_id, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Wallet transactions retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const withdraw = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.requestWithdrawal(req.user.user_id, Number(req.body.amount));
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdrawal request submitted successfully',
        data: result,
    });
});
const getMyWithdrawals = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.getMyWithdrawals(req.user.user_id, req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdrawals retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
// ** ---------- Admin ----------
const getAllWithdrawals = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.getAllWithdrawals(req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Withdrawals retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});
const retryPayout = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.retryPayout(req.params.id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Payout retry attempted',
        data: result,
    });
});
const getCommission = (0, catch_async_1.default)(async (_req, res) => {
    const result = await wallet_service_1.WalletServices.getCommission();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Commission retrieved successfully',
        data: result,
    });
});
const updateCommission = (0, catch_async_1.default)(async (req, res) => {
    const result = await wallet_service_1.WalletServices.updateCommission(Number(req.body.percentage));
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Commission updated successfully',
        data: result,
    });
});
exports.WalletController = {
    getMyWallet,
    getMyTransactions,
    withdraw,
    getMyWithdrawals,
    getAllWithdrawals,
    retryPayout,
    getCommission,
    updateCommission,
};
//# sourceMappingURL=wallet.controller.js.map
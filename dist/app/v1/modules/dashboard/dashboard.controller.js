"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParcelOwnerGrowth = exports.getParcelMovementStats = exports.getDashboardStats = void 0;
// controller.ts
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const dashboard_service_1 = require("./dashboard.service");
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
exports.getDashboardStats = (0, catch_async_1.default)(async (req, res) => {
    const result = await (0, dashboard_service_1.getDashboardStatsFromDB)();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: result,
    });
});
exports.getParcelMovementStats = (0, catch_async_1.default)(async (req, res) => {
    const { year } = req.query;
    const result = await (0, dashboard_service_1.getParcelMovementStatsFromDB)(year);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel movement stats retrieved successfully',
        data: result,
    });
});
exports.getParcelOwnerGrowth = (0, catch_async_1.default)(async (req, res) => {
    const { year } = req.query;
    const result = await (0, dashboard_service_1.getParcelOwnerGrowthFromDB)(year);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel owner growth stats retrieved successfully',
        data: result,
    });
});
//# sourceMappingURL=dashboard.controller.js.map
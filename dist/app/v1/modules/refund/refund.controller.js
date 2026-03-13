"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const refund_service_1 = require("./refund.service");
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const requestRefund = (0, catch_async_1.default)(async (req, res) => {
    const { parcelId } = req.params;
    const { reason } = req.body;
    const userId = req.user.user_id;
    const result = await refund_service_1.RefundServices.createRefundRequest(userId, parcelId, reason);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Refund request submitted successfully',
        data: result,
    });
});
const adminRefundDecision = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params; // Request ID
    const result = await refund_service_1.RefundServices.processRefundDecision(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Refund request ${req.body.action.toLowerCase()}ed successfully`,
        data: result,
    });
});
exports.RefundControllers = {
    requestRefund,
    adminRefundDecision,
};
//# sourceMappingURL=refund.controller.js.map
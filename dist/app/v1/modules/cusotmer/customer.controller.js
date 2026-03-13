"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const customer_service_1 = require("./customer.service");
const getAllCustomer = (0, catch_async_1.default)(async (req, res) => {
    console.log('query', req.query);
    const result = await customer_service_1.CustomerServices.getAllUsersFromDB(req.query);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
});
exports.UserControllers = {
    getAllCustomer,
};
//# sourceMappingURL=customer.controller.js.map
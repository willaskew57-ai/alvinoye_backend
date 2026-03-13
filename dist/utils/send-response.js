"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        average_rating: data.average_rating,
        meta: data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
//# sourceMappingURL=send-response.js.map
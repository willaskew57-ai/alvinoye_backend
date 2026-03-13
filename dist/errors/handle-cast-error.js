"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleCastError = (err) => {
    const errorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Invalid ID',
        errorSources,
    };
};
exports.default = handleCastError;
//# sourceMappingURL=handle-cast-error.js.map
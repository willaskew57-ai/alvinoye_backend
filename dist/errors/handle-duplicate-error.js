"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleDuplicateError = (err) => {
    const keyPattern = err.keyPattern || {};
    const key = Object.keys(keyPattern)[0];
    const keyValue = err.keyValue?.[key];
    const errorSources = [
        {
            path: key || 'unknown',
            message: `"${keyValue || 'this value'}" already exists`,
        },
    ];
    const statusCode = http_status_1.default.BAD_REQUEST;
    return {
        statusCode,
        message: `Duplicate field value: ${key || 'unknown'} already exists`,
        errorSources,
    };
};
exports.default = handleDuplicateError;
//# sourceMappingURL=handle-duplicate-error.js.map
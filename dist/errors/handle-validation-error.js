"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleValidationError = (err) => {
    const errorSources = Object.values(err.errors).map((val) => {
        return {
            path: val.path,
            message: val.message,
        };
    });
    const statusCode = http_status_1.default.BAD_REQUEST;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
exports.default = handleValidationError;
//# sourceMappingURL=handle-validation-error.js.map
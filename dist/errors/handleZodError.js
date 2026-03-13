"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => {
        const path = String(issue.path[issue.path.length - 1] ?? 'unknown');
        return {
            path,
            message: issue.message,
        };
    });
    return {
        statusCode: http_status_1.default.BAD_REQUEST,
        message: 'Validation Error!',
        errorSources,
    };
};
exports.default = handleZodError;
//# sourceMappingURL=handleZodError.js.map
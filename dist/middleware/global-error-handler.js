"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
// ** import local files
const env_config_1 = __importDefault(require("../config/env.config"));
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const handle_validation_error_1 = __importDefault(require("../errors/handle-validation-error"));
const handle_cast_error_1 = __importDefault(require("../errors/handle-cast-error"));
const handle_duplicate_error_1 = __importDefault(require("../errors/handle-duplicate-error"));
const app_error_1 = __importDefault(require("../errors/app-error"));
const globalErrorHandler = async (err, req, res, next) => {
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = 'Something Went Wrong!!!';
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong!!!',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err?.name === 'ValidationError') {
        const simplifiedError = (0, handle_validation_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err?.name === 'CastError') {
        const simplifiedError = (0, handle_cast_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err?.code === 11000) {
        const simplifiedError = (0, handle_duplicate_error_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof app_error_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: '',
                message: err?.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err?.message;
    }
    return res.status(statusCode).send({
        success: false,
        message,
        errorSources,
        // err,
        stack: env_config_1.default.node_env === 'development' ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=global-error-handler.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
// ** import packages
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ** import local files
const app_error_1 = __importDefault(require("../errors/app-error"));
const user_model_1 = __importDefault(require("../app/v1/modules/user/user.model"));
const env_config_1 = __importDefault(require("../config/env.config"));
const socketAuth = (...requiredRoles) => async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            return next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.jwt_access_token);
        const { user_id, role, iat } = decoded;
        const user = await user_model_1.default.isUserExistsById(user_id);
        if (!user) {
            return next(new app_error_1.default(http_status_1.default.NOT_FOUND, 'Your Account Is Not Exists!!!'));
        }
        if (await user_model_1.default.isUserDeleted(user)) {
            return next(new app_error_1.default(http_status_1.default.NOT_FOUND, 'You are Deleted!!!'));
        }
        if (await user_model_1.default.isUserBlocked(user)) {
            return next(new app_error_1.default(http_status_1.default.BAD_REQUEST, 'You are Blocked!!!'));
        }
        if (user.password_changed_at &&
            user_model_1.default.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
            return next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'Password was changed. Please login again.'));
        }
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            return next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'You are not Authorized !!!'));
        }
        socket.user = decoded;
        next();
    }
    catch (error) {
        next(new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!!'));
    }
};
exports.socketAuth = socketAuth;
//# sourceMappingURL=socket-auth.js.map
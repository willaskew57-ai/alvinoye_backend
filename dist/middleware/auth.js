"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// ** imports packages
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // removed JwtPayload import as we'll use your custom one
// ** import local files
const app_error_1 = __importDefault(require("../errors/app-error"));
const catch_async_1 = __importDefault(require("../utils/catch-async"));
const user_model_1 = __importDefault(require("../app/v1/modules/user/user.model"));
const env_config_1 = __importDefault(require("../config/env.config"));
const auth = (...requiredRoles) => {
    return (0, catch_async_1.default)(async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_config_1.default.jwt_access_token);
        }
        catch (err) {
            throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized 2!!');
        }
        const { user_id, role, iat } = decoded;
        const user = await user_model_1.default.isUserExistsById(user_id);
        if (!user) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Your Account Is Not Exists!!!');
        }
        if (await user_model_1.default.isUserDeleted(user)) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'You are Deleted!!!');
        }
        if (await user_model_1.default.isUserBlocked(user)) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'You are Blocked!!!');
        }
        if (user.password_changed_at &&
            user_model_1.default.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
            throw new app_error_1.default(http_status_1.default.UNAUTHORIZED, 'Password was changed. Please login again.');
        }
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'You are not Authorized !!!');
        }
        req.user = decoded;
        next();
    });
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map
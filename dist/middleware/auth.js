// ** imports packages
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken'; // removed JwtPayload import as we'll use your custom one
// ** import local files
import AppError from '../errors/app-error';
import catchAsync from '../utils/catch-async';
import User from '../app/v1/modules/user/user.model';
import configs from '../config/env.config';
export const auth = (...requiredRoles) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }
        //  Declare decoded as your custom TUserPayload type
        let decoded;
        try {
            // Cast directly to TUserPayload here
            decoded = jwt.verify(token, configs.jwt_access_token);
        }
        catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!');
        }
        //  Now destructuring works without extra casting
        const { user_id, role, iat } = decoded;
        // check isUserExists:
        const user = await User.isUserExistsById(user_id);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'Your Account Is Not Exists!!!');
        }
        // check is user deleted:
        if (await User.isUserDeleted(user)) {
            throw new AppError(httpStatus.NOT_FOUND, 'You are Deleted!!!');
        }
        // check is user blocked:
        if (await User.isUserBlocked(user)) {
            throw new AppError(httpStatus.BAD_REQUEST, 'You are Blocked!!!');
        }
        // is JWT issued before password changed?:
        if (user.password_changed_at &&
            User.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Password was changed. Please login again.');
        }
        //  Checking role compatibility works because 'role' is now TUserRole
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !!!');
        }
        //  This assignment now works perfectly because types match exactly
        req.user = decoded;
        next();
    });
};
//# sourceMappingURL=auth.js.map
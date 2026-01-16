// ** import packages
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
// ** import local files
import AppError from '../errors/app-error';
import User from '../app/v1/modules/user/user.model';
import configs from '../config';
export const socketAuth = (...requiredRoles) => async (socket, next) => {
    try {
        // 🔑 token from socket handshake
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(' ')[1];
        if (!token) {
            return next(new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!'));
        }
        // verify token
        const decoded = jwt.verify(token, configs.jwt_access_token);
        const { user_id, role, iat } = decoded;
        // check isUserExists
        const user = await User.isUserExistsById(user_id);
        if (!user) {
            return next(new AppError(httpStatus.NOT_FOUND, 'Your Account Is Not Exists!!!'));
        }
        // check deleted
        if (await User.isUserDeleted(user)) {
            return next(new AppError(httpStatus.NOT_FOUND, 'You are Deleted!!!'));
        }
        // check blocked
        if (await User.isUserBlocked(user)) {
            return next(new AppError(httpStatus.BAD_REQUEST, 'You are Blocked!!!'));
        }
        // password change check
        if (user.password_changed_at &&
            User.isJWTIssuedBeforePasswordChanged(user.password_changed_at, iat)) {
            return next(new AppError(httpStatus.UNAUTHORIZED, 'Password was changed. Please login again.'));
        }
        // role check
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            return next(new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !!!'));
        }
        // ✅ attach user to socket
        socket.user = decoded;
        next();
    }
    catch (error) {
        next(new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!'));
    }
};
//# sourceMappingURL=socket-auth.js.map
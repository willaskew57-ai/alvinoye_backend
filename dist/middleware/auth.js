// ** imports packages
import httpStatus from 'http-status';
import jwt, {} from 'jsonwebtoken';
// ** import local files
import AppError from '../errors/app-error';
import catchAsync from '../utils/catchAsync';
import User from '../app/v1/modules/user/user.model';
import configs from '../config';
export const auth = (...requiredRoles) => {
    return catchAsync(async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }
        //  verify jwt token :
        let decoded;
        console.log('Verifying token:', token);
        try {
            decoded = jwt.verify(token, configs.jwt_access_token);
        }
        catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Your are not authorized!!');
        }
        // destructure decoded object:
        const { userId, role, iat } = decoded;
        // check isUserExists:
        const user = await User.isUserExistsById(userId);
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
        console.log('Required Roles:', requiredRoles);
        if (requiredRoles && !requiredRoles.includes(role)) {
            // check user is authorized for this  route by role?:
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !!!');
        }
        // set the decoded  object as user in request object:
        req.user = decoded; // define a type index.d.ts in interface folder to assign this req.user type globally.
        next();
    });
};
//# sourceMappingURL=auth.js.map
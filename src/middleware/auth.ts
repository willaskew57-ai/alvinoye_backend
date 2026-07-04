// ** imports packages
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken'; // removed JwtPayload import as we'll use your custom one

// ** import local files
import AppError from '../errors/app-error';
import catchAsync from '../utils/catch-async';
import User from '../app/v1/modules/user/user.model';
import configs from '../config/env.config';
import type { TUserRole } from '../app/v1/modules/user/user.interface';
import type { TUserPayload } from '../interfaces';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    let decoded: TUserPayload;

    try {
      decoded = jwt.verify(
        token,
        configs.jwt_access_token as string
      ) as TUserPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized 2!!');
    }

    const { user_id, role, iat } = decoded;

    const user = await User.isUserExistsById(user_id);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Your Account Is Not Exists!!!');
    }

    if (await User.isUserDeleted(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'You are Deleted!!!');
    }

    if (await User.isUserBlocked(user)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'You are Blocked!!!');
    }

    if (
      user.password_changed_at &&
      User.isJWTIssuedBeforePasswordChanged(
        user.password_changed_at,
        iat as number
      )
    ) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Password was changed. Please login again.'
      );
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not Authorized !!!');
    }

    req.user = decoded;

    next();
  });
};

// ** import packages
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

// ** import local files
import AppError from '../errors/app-error';
import User from '../app/v1/modules/user/user.model';
import configs from '../config/env.config';
import type { TUserRole } from '../app/v1/modules/user/user.interface';
import type { TUserPayload } from '../interfaces';

export const socketAuth =
  (...requiredRoles: TUserRole[]) =>
  async (socket: any, next: any) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
        );
      }

      const decoded = jwt.verify(
        token,
        configs.jwt_access_token as string
      ) as TUserPayload;

      const { user_id, role, iat } = decoded;

      const user = await User.isUserExistsById(user_id);
      if (!user) {
        return next(
          new AppError(httpStatus.NOT_FOUND, 'Your Account Is Not Exists!!!')
        );
      }

      if (await User.isUserDeleted(user)) {
        return next(new AppError(httpStatus.NOT_FOUND, 'You are Deleted!!!'));
      }

      if (await User.isUserBlocked(user)) {
        return next(new AppError(httpStatus.BAD_REQUEST, 'You are Blocked!!!'));
      }

      if (
        user.password_changed_at &&
        User.isJWTIssuedBeforePasswordChanged(
          user.password_changed_at,
          iat as number
        )
      ) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            'Password was changed. Please login again.'
          )
        );
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return next(
          new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !!!')
        );
      }

      socket.user = decoded;

      next();
    } catch (error) {
      next(new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!!'));
    }
  };

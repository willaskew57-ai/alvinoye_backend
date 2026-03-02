import express from 'express';
import { auth } from '../../../../middleware/auth';
import { NotificationControllers } from './notification.controller';
import { USER_ROLE } from '../user/user.interface';

const router = express.Router();

/**
 * @route GET /api/v1/notifications
 * @desc Get all notifications for logged-in user
 * @access Private - All authenticated users
 */
router.get(
  '/get-all',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.getUserNotifications
);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notification count
 * @access Private - All authenticated users
 */
router.get(
  '/unread-count',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.getUnreadCount
);

/**
 * @route PATCH /api/v1/notifications/mark-all-read
 * @desc Mark all notifications as read
 * @access Private - All authenticated users
 */
router.patch(
  '/mark-all-read',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.markAllAsRead
);

/**
 * @route DELETE /api/v1/notifications
 * @desc Delete all notifications
 * @access Private - All authenticated users
 */
router.delete(
  '/',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.deleteAllNotifications
);

/**
 * @route GET /api/v1/notifications/:id
 * @desc Get single notification
 * @access Private - All authenticated users
 */
router.get(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.getSingleNotification
);

/**
 * @route PATCH /api/v1/notifications/:id/read
 * @desc Mark notification as read
 * @access Private - All authenticated users
 */
router.patch(
  '/:id/read',
  auth(USER_ROLE.SUPER_ADMIN,  USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.markAsRead
);

/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Delete a notification
 * @access Private - All authenticated users
 */
router.delete(
  '/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER),
  NotificationControllers.deleteNotification
);

export const NotificationRoutes = router;

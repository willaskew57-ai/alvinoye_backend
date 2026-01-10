import express from 'express';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.zod-validation';
import validateRequest from '../../../../middleware/validate-request';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from './user.constants';

const router = express.Router();

// Only SUPER_ADMIN can create a user directly via this admin route
router.post(
  '/create',
  auth(USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser
);

// Admins and Super Admins can view user lists (with optional ?role= filter)
router.get(
  '/get',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  UserControllers.getAllUser
);

router.get(
  '/get-single/:id',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  UserControllers.getSingleUser
);

router.patch(
  '/update/:id',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateUser
);

router.delete(
  '/delete/:id',
  auth(
    USER_ROLE.ADMIN,
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ), // Only Super Admin can delete users
  UserControllers.deleteUser
);

export const UserRoutes = router;

import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.zod-validation';
import validateRequest from '../../../../middleware/validate-request';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from './user.interface';
import { uploadFile } from '../../../../aws/multer-s3-uploader';

const router = express.Router();

// Only SUPER_ADMIN can create a user directly via this admin route
router.post(
  '/create-admin',
  auth(USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createAdminValidationSchema),
  UserControllers.createAdmin
);

router.patch(
  '/change-status/:id',
  auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus
);

router.get(
  '/get-all',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  UserControllers.getAllUser
);

// --- Profile Routes ---

router.get(
  '/get-me',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  UserControllers.getMe
);

router.patch(
  '/update-me',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  uploadFile(),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body)
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    next();
  },
  validateRequest(UserValidation.updateUserValidationSchema),
  UserControllers.updateMe
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
  ),
  UserControllers.deleteUser
);

export const UserRoutes = router;

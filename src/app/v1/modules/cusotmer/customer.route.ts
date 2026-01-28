import express from 'express';
import { UserControllers } from './customer.controller';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from '../user/user.interface';

const router = express.Router();

router.get(
  '/get-all',
  auth(
    USER_ROLE.SUPER_ADMIN,
    USER_ROLE.ADMIN,
    USER_ROLE.CUSTOMER,
    USER_ROLE.DRIVER
  ),
  UserControllers.getAllCustomer
);



export const CustomerRoutes = router;

import express from 'express';
import { UserControllers } from './customer.controller';
import validateRequest from '../../../../middleware/validate-request';
import { auth } from '../../../../middleware/auth';
import { USER_ROLE } from '../user/user.interface';
const router = express.Router();
router.get('/get-all', auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.CUSTOMER, USER_ROLE.DRIVER), UserControllers.getAllCustomer);
router.delete('/delete-account', auth(USER_ROLE.CUSTOMER, USER_ROLE.DRIVER), UserControllers.deleteCustomerAccount);
export const CustomerRoutes = router;
//# sourceMappingURL=customer.route.js.map
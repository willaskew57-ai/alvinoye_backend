import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { CustomerServices } from './customer.service';

const getAllCustomer = catchAsync(async (req, res) => {
  console.log('query', req.query);

  const result = await CustomerServices.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const deleteCustomerAccount = catchAsync(async (req, res) => {
  const id = req.user.user_id as string;
  await CustomerServices.deleteUserFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const UserControllers = {
  getAllCustomer,
  deleteCustomerAccount,
};

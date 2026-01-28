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

export const UserControllers = {
  getAllCustomer,
};

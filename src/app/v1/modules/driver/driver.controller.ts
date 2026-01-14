import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { DriverServices } from './driver.service';

const registerDriver = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.user.user_id;
  console.log('User ID from token:', req.user);
  const result = await DriverServices.addDriverInfoIntoDB(req.body, user_id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Driver profile created successfully!',
    data: result,
  });
});

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverServices.getAllDriversFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Drivers retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDriver = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const driverId = id as string;
  const result = await DriverServices.getSingleDriverFromDB(driverId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver retrieved successfully!',
    data: result,
  });
});

export const DriverController = {
  registerDriver,
  getAllDrivers,
  getSingleDriver,
};

import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { DriverServices } from './driver.service';
import { getLocalFileUrl } from '../../../../utils/fileUploadHelper';

const registerDriver = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.user.user_id;
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[] | undefined;
  };

  // 1. Handle License Image
  if (files?.license_image?.[0]) {
    req.body.driverInfo.license_image = getLocalFileUrl(
      files.license_image[0].path
    );
  }

  // 2. Handle Number Plate Image
  if (files?.number_plate_image?.[0]) {
    req.body.vehicle.number_plate_image = getLocalFileUrl(
      files.number_plate_image[0].path
    );
  }

  // 3. Handle Multiple Vehicle Images
  if (files?.vehicle_images) {
    req.body.vehicle.vehicle_images = files.vehicle_images.map((file) =>
      getLocalFileUrl(file.path)
    );
  }

  const result = await DriverServices.addDriverInfoIntoDB(req.body, user_id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Driver profile created successfully!',
    data: result,
  });
});

// driver.controller.ts
const updateDriverInfo = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.user.user_id;
  const result = await DriverServices.updateDriverInfoInDB(user_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver info updated successfully',
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
  const driver = req.user;

  const result = await DriverServices.getSingleDriverFromDB(driver.user_id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver retrieved successfully!',
    data: result,
  });
});

// ** ------------- parcel related api ------------- ** //
const acceptParcel = catchAsync(async (req, res) => {
  const driverId = req.user.user_id;
  const result = await DriverServices.acceptParcelFromDB(
    req.params.id as string,
    driverId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel accepted successfully',
    data: result,
  });
});

const verifyParcelOtp = catchAsync(async (req, res) => {
  const { parcel_id, otp } = req.body;

  const result = await DriverServices.verifyParcelOtpFromDB({
    parcel_id,
    otp,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel OTP verified successfully',
    data: result,
  });
});

/**
 * Complete Parcel (after OTP verification)
 */
const completeParcel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const driver_id = req.user.user_id;

  const result = await DriverServices.completeParcelFromDB(
    id as string,
    driver_id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel completed successfully',
    data: result,
  });
});

export const DriverController = {
  registerDriver,
  updateDriverInfo,
  getAllDrivers,
  getSingleDriver,
  acceptParcel,
  verifyParcelOtp,
  completeParcel,
};

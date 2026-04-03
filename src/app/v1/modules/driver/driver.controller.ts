import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { DriverServices } from './driver.service';
import { getCloudFrontUrl, S3File } from '../../../../aws/multer-s3-uploader';

const registerDriver = catchAsync(async (req: Request, res: Response) => {
  const user_id = req.user.user_id;

  const files = req.files as {
    [fieldname: string]: S3File[] | undefined;
  };

  if (!req.body.driverInfo) req.body.driverInfo = {};
  if (!req.body.vehicle) req.body.vehicle = {};

  if (files?.license_image?.[0]) {
    req.body.driverInfo.license_image = getCloudFrontUrl(
      files.license_image[0].key
    );
  }

  if (files?.number_plate_image?.[0]) {
    req.body.vehicle.number_plate_image = getCloudFrontUrl(
      files.number_plate_image[0].key
    );
  }

  // 3. Handle Multiple Vehicle Images (Array)
  if (files?.vehicle_images) {
    req.body.vehicle.vehicle_images = files.vehicle_images.map((file: S3File) =>
      getCloudFrontUrl(file.key)
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

const getDriverById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DriverServices.getSingleDriverFromDB(id as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Driver retrieved successfully!',
    data: result,
  });
});

// ** ------------- parcel related api ------------- ** //

const getAvailableParcelsForDriver = catchAsync(
  async (req: Request, res: Response) => {
    const user_id = req.user.user_id;

    const result = await DriverServices.getAvailableParcelsFromDB(
      user_id,
      req.query
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Available parcels fetched successfully!',
      data: result,
    });
  }
);

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

const selectParcel = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.user.user_id;
  const { parcel_id, routeContext } = req.body;

  const result = await DriverServices.selectParcelFromDB({
    parcel_id,
    driverId,
    routeContext,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel selected successfully',
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
  getAvailableParcelsForDriver,
  getDriverById,
  selectParcel,
};

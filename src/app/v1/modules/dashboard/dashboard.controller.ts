
// controller.ts
import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import { getDashboardStatsFromDB, getParcelMovementStatsFromDB, getParcelOwnerGrowthFromDB } from './dashboard.service';
import sendResponse from '../../../../utils/send-response';


export const getDashboardStats = catchAsync(async (req, res) => {
  const result = await getDashboardStatsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: result,
  });
});

export const getParcelMovementStats = catchAsync(async (req, res) => {
  const { year } = req.query;
  const result = await getParcelMovementStatsFromDB(year as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel movement stats retrieved successfully',
    data: result,
  });
});

export const getParcelOwnerGrowth = catchAsync(async (req, res) => {
  const { year } = req.query;
  const result = await getParcelOwnerGrowthFromDB(year as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel owner growth stats retrieved successfully',
    data: result,
  });
});
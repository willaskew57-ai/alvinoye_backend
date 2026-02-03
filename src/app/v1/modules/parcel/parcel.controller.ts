import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { ParcelServices } from './parcel.service';

const createParcel = catchAsync(async (req, res) => {
  const user_id = req.user.user_id;

  const result = await ParcelServices.createParcelIntoDB(user_id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Parcel booked successfully',
    data: result,
  });
});

const getAllParcels = catchAsync(async (req, res) => {
  const result = await ParcelServices.getAllParcelsFromDB(req.query, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcels retrieved successfully',
    data: result,
  });
});

const getMyParcels = catchAsync(async (req, res) => {
  const { user_id, role } = req.user;
  const result = await ParcelServices.getMyParcelsFromDB(
    req.query,
    user_id,
    role
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My parcels retrieved successfully',
    data: result,
  });
});

const getSingleParcel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ParcelServices.getSingleParcelFromDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel retrieved successfully',
    data: result,
  });
});

const updateParcel = catchAsync(async (req, res) => {
  const { id } = req.params;

  // req.body now contains synced image arrays and parsed numbers
  const result = await ParcelServices.updateParcelInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel updated successfully',
    data: result,
  });
});

const rejectParcel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ParcelServices.rejectParcelFromDB(
    id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Parcel rejected successfully',
    data: result,
  });
});

const requestForPrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ParcelServices.requestForPriceInDB(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Price request sent successfully',
    data: result,
  });
});

// --- Price Negotiation ---

const proposePrice = catchAsync(async (req, res) => {
  const { role } = (req as any).user;
  const result = await ParcelServices.proposePriceInDB(role, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Price proposal submitted successfully',
    data: result,
  });
});

const acceptPrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await ParcelServices.acceptPriceProposalInDB(
    id as string,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Price proposal Accepted successfully`,
    data: result,
  });
});

const rejectPrice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const result = await ParcelServices.rejectPriceProposalInDB(
    id as string,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Price proposal rejected successfully',
    data: result,
  });
});

/**
 * Controller: Handles the "Reject reason" + "Suggested price" popup from Customer
 */
const rejectAndCounter = catchAsync(async (req, res) => {
  const { id } = req.params; // Request ID of the Admin offer
  const result = await ParcelServices.rejectAndCounterPriceInDB(
    id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Price rejected and counter-offer submitted successfully',
    data: result,
  });
});

/**
 * Controller: Admin rejects customer price and sends final "Take it or leave it" price
 */
const adminFinalOffer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ParcelServices.adminRejectAndFinalOfferInDB(
    id as string,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer counter rejected and final offer sent',
    data: result,
  });
});

export const ParcelControllers = {
  createParcel,
  getAllParcels,
  getMyParcels,
  getSingleParcel,
  updateParcel,
  requestForPrice,
  rejectParcel,

  proposePrice,
  rejectPrice,
  acceptPrice,
  rejectAndCounter,
  adminFinalOffer,
};

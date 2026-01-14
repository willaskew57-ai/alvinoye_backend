import httpStatus from 'http-status';
import catchAsync from '../../../../utils/catch-async';
import sendResponse from '../../../../utils/send-response';
import { ParcelServices } from './parcel.service';
// --- Core Parcel CRUD ---
const createParcel = catchAsync(async (req, res) => {
    // Extract user_id from token (TUserPayload)
    const result = await ParcelServices.createParcelIntoDB(req.user.user_id, req.body);
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
const getSingleParcel = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ParcelServices.getSingleParcelFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel retrieved successfully',
        data: result,
    });
});
const updateParcel = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await ParcelServices.updateParcelInDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Parcel updated successfully',
        data: result,
    });
});
// --- Price Negotiation ---
const proposePrice = catchAsync(async (req, res) => {
    const { user_id, role } = req.user;
    const result = await ParcelServices.proposePriceInDB(user_id, role, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Price proposal submitted successfully',
        data: result,
    });
});
const respondToPrice = catchAsync(async (req, res) => {
    const { id } = req.params; // This is the ID from parcel_price_requests table
    const { status, rejection_reason } = req.body;
    const user = req.user;
    const result = await ParcelServices.respondToPriceProposalInDB(id, status, user, rejection_reason);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Price proposal ${status.toLowerCase()} successfully`,
        data: result,
    });
});
const getPriceHistory = catchAsync(async (req, res) => {
    const { id } = req.params; // parcel_id
    const result = await ParcelServices.getPriceHistoryFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Price history retrieved successfully',
        data: result,
    });
});
export const ParcelControllers = {
    createParcel,
    getAllParcels,
    getSingleParcel,
    updateParcel,
    proposePrice,
    respondToPrice,
    getPriceHistory,
};
//# sourceMappingURL=parcel.controller.js.map
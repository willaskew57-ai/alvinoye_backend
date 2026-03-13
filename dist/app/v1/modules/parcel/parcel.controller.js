"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catch_async_1.default)(async (req, res) => {
    const user_id = req.user.user_id;
    const result = await parcel_service_1.ParcelServices.createParcelIntoDB(user_id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Parcel booked successfully',
        data: result,
    });
});
const getAllParcels = (0, catch_async_1.default)(async (req, res) => {
    const result = await parcel_service_1.ParcelServices.getAllParcelsFromDB(req.query, req.user);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcels retrieved successfully',
        data: result,
    });
});
const getMyParcels = (0, catch_async_1.default)(async (req, res) => {
    const { user_id, role } = req.user;
    const result = await parcel_service_1.ParcelServices.getMyParcelsFromDB(req.query, user_id, role);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My parcels retrieved successfully',
        data: result,
    });
});
const getSingleParcel = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.getSingleParcelFromDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel retrieved successfully',
        data: result,
    });
});
const updateParcel = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.updateParcelInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel updated successfully',
        data: result,
    });
});
const rejectParcel = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.rejectParcelFromDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Parcel rejected successfully',
        data: result,
    });
});
const requestForPrice = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.requestForPriceInDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Price request sent successfully',
        data: result,
    });
});
// --- Price Negotiation ---
const proposePrice = (0, catch_async_1.default)(async (req, res) => {
    const { role } = req.user;
    const result = await parcel_service_1.ParcelServices.proposePriceInDB(role, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Price proposal submitted successfully',
        data: result,
    });
});
const acceptPrice = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await parcel_service_1.ParcelServices.acceptPriceProposalInDB(id, user);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `Price proposal Accepted successfully`,
        data: result,
    });
});
const rejectPrice = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await parcel_service_1.ParcelServices.rejectPriceProposalInDB(id, user);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Price proposal rejected successfully',
        data: result,
    });
});
const rejectAndCounter = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.rejectAndCounterPriceInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Price rejected and counter-offer submitted successfully',
        data: result,
    });
});
const adminFinalOffer = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await parcel_service_1.ParcelServices.adminRejectAndFinalOfferInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Customer counter rejected and final offer sent',
        data: result,
    });
});
exports.ParcelControllers = {
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
//# sourceMappingURL=parcel.controller.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const parcel_model_1 = require("../parcel/parcel.model");
const payment_model_1 = require("../payment/payment.model");
const refund_constants_1 = require("./refund.constants");
const refund_model_1 = require("./refund.model");
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const createRefundRequest = async (userId, parcelId, reason) => {
    // 1. Check if parcel exists and belongs to the user
    const parcel = await parcel_model_1.Parcel.findOne({ _id: parcelId, user_id: userId });
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found or unauthorized');
    }
    // 2. Check if a successful payment exists for this parcel
    const payment = await payment_model_1.Payment.findOne({
        parcel_id: parcelId,
        status: 'PAID', // Assuming PAID is your success constant
    });
    if (!payment) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'No successful payment found for this parcel');
    }
    // 3. Check if a refund request already exists
    const existingRequest = await refund_model_1.RefundRequest.findOne({ parcel_id: parcelId });
    if (existingRequest) {
        throw new app_error_1.default(http_status_1.default.CONFLICT, 'A refund request already exists for this parcel');
    }
    // 4. Create the request
    const result = await refund_model_1.RefundRequest.create({
        user_id: userId,
        parcel_id: parcelId,
        reason,
    });
    return result;
};
const processRefundDecision = async (requestId, payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const request = await refund_model_1.RefundRequest.findById(requestId)
            .populate('parcel_id')
            .session(session);
        if (!request)
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Refund request not found');
        if (request.status !== refund_constants_1.REFUND_STATUS.PENDING) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This request has already been processed');
        }
        if (payload.action === 'REJECT') {
            request.status = refund_constants_1.REFUND_STATUS.REJECTED;
            request.admin_note = payload.adminNote;
            await request.save({ session });
            await session.commitTransaction();
            // Notify user about rejection
            try {
                await notification_service_1.NotificationServices.createNotificationIntoDB({
                    user_id: request.user_id.toString(),
                    type: notification_constant_1.NOTIFICATION_TYPE.REFUND_REJECTED,
                    title: 'Refund Rejected',
                    message: `Your refund request for parcel has been rejected.`,
                    parcel_id: request.parcel_id,
                    data: {
                        reason: payload.adminNote
                    }
                });
            }
            catch (error) {
                console.error('Failed to create notification:', error);
            }
            return request;
        }
        // --- APPROVAL LOGIC (Stripe Integration) ---
        const payment = await payment_model_1.Payment.findOne({
            parcel_id: request.parcel_id,
        }).session(session);
        if (!payment || !payment.transaction_id) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Original payment record not found');
        }
        // Update Request
        request.status = refund_constants_1.REFUND_STATUS.REFUNDED;
        request.refunded_at = new Date();
        request.admin_note = payload.adminNote;
        await request.save({ session });
        // Update Payment Status
        await payment_model_1.Payment.findByIdAndUpdate(payment._id, { status: 'REFUNDED' }, { session });
        // Update Parcel Status
        await parcel_model_1.Parcel.findByIdAndUpdate(request.parcel_id, { status: 'REJECTED' }, { session });
        await session.commitTransaction();
        // Notify user about approval
        try {
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: request.user_id.toString(),
                type: notification_constant_1.NOTIFICATION_TYPE.REFUND_APPROVED,
                title: 'Refund Approved',
                message: `Your refund request for parcel has been approved.`,
                parcel_id: request.parcel_id,
                data: {
                    admin_note: payload.adminNote
                }
            });
        }
        catch (error) {
            console.error('Failed to create notification:', error);
        }
        return request;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
const getAllRefundsFromDB = async (query) => {
    const refundQuery = new query_builder_1.default(refund_model_1.RefundRequest.find()
        .populate('user_id', 'full_name email phone_number profile_picture')
        .populate('parcel_id', 'parcel_id parcel_name final_price status'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await refundQuery.modelQuery;
    const meta = await refundQuery.countTotal();
    return { meta, data };
};
exports.RefundServices = {
    createRefundRequest,
    getAllRefundsFromDB,
    processRefundDecision,
};
//# sourceMappingURL=refund.service.js.map
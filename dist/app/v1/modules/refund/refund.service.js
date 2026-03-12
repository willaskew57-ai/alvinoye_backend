import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Stripe from 'stripe';
import { Parcel } from '../parcel/parcel.model';
import { Payment } from '../payment/payment.model';
import { REFUND_STATUS } from './refund.constants';
import { RefundRequest } from './refund.model';
import AppError from '../../../../errors/app-error';
import configs from '../../../../config/env.config';
import { NotificationServices } from '../notification/notification.service';
import { NOTIFICATION_TYPE } from '../notification/notification.constant';
const createRefundRequest = async (userId, parcelId, reason) => {
    // 1. Check if parcel exists and belongs to the user
    const parcel = await Parcel.findOne({ _id: parcelId, user_id: userId });
    if (!parcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found or unauthorized');
    }
    // 2. Check if a successful payment exists for this parcel
    const payment = await Payment.findOne({
        parcel_id: parcelId,
        status: 'PAID', // Assuming PAID is your success constant
    });
    if (!payment) {
        throw new AppError(httpStatus.BAD_REQUEST, 'No successful payment found for this parcel');
    }
    // 3. Check if a refund request already exists
    const existingRequest = await RefundRequest.findOne({ parcel_id: parcelId });
    if (existingRequest) {
        throw new AppError(httpStatus.CONFLICT, 'A refund request already exists for this parcel');
    }
    // 4. Create the request
    const result = await RefundRequest.create({
        user_id: userId,
        parcel_id: parcelId,
        reason,
    });
    return result;
};
const processRefundDecision = async (requestId, payload) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const request = await RefundRequest.findById(requestId)
            .populate('parcel_id')
            .session(session);
        if (!request)
            throw new AppError(httpStatus.NOT_FOUND, 'Refund request not found');
        if (request.status !== REFUND_STATUS.PENDING) {
            throw new AppError(httpStatus.BAD_REQUEST, 'This request has already been processed');
        }
        if (payload.action === 'REJECT') {
            request.status = REFUND_STATUS.REJECTED;
            request.admin_note = payload.adminNote;
            await request.save({ session });
            await session.commitTransaction();
            // Notify user about rejection
            try {
                await NotificationServices.createNotificationIntoDB({
                    user_id: request.user_id.toString(),
                    type: NOTIFICATION_TYPE.REFUND_REJECTED,
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
        const payment = await Payment.findOne({
            parcel_id: request.parcel_id,
        }).session(session);
        if (!payment || !payment.transaction_id) {
            throw new AppError(httpStatus.NOT_FOUND, 'Original payment record not found');
        }
        // Update Request
        request.status = REFUND_STATUS.REFUNDED;
        request.refunded_at = new Date();
        request.admin_note = payload.adminNote;
        await request.save({ session });
        // Update Payment Status
        await Payment.findByIdAndUpdate(payment._id, { status: 'REFUNDED' }, { session });
        // Update Parcel Status
        await Parcel.findByIdAndUpdate(request.parcel_id, { status: 'REJECTED' }, { session });
        await session.commitTransaction();
        // Notify user about approval
        try {
            await NotificationServices.createNotificationIntoDB({
                user_id: request.user_id.toString(),
                type: NOTIFICATION_TYPE.REFUND_APPROVED,
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
export const RefundServices = {
    createRefundRequest,
    processRefundDecision,
};
//# sourceMappingURL=refund.service.js.map
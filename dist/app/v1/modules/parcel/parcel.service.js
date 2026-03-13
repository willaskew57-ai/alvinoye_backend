"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const user_interface_1 = require("../user/user.interface");
const parcel_model_1 = require("./parcel.model");
const parcel_interface_1 = require("./parcel.interface");
const parcel_utils_1 = require("./parcel.utils");
const deleteFromS3_1 = require("../../../../aws/deleteFromS3");
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
// ** ----- create parcel -----
// parcel.service.ts
const createParcelIntoDB = async (userId, payload) => {
    const parcelData = {
        ...payload,
        user_id: userId,
        parcel_id: (0, parcel_utils_1.generateParcelId)(), // Ensure you have this helper
        status: 'INITIAL',
        price_status: 'NOT_SET',
    };
    const result = await parcel_model_1.Parcel.create(parcelData);
    // Create notification for parcel creation
    try {
        await notification_service_1.NotificationServices.createNotificationIntoDB({
            user_id: userId,
            type: notification_constant_1.NOTIFICATION_TYPE.PARCEL_CREATED,
            title: 'Parcel Created',
            message: `Your parcel "${result.parcel_name}" has been created successfully.`,
            parcel_id: result._id,
            data: {
                parcel_name: result.parcel_name,
                parcel_id: result.parcel_id,
            },
        });
    }
    catch (error) {
        console.error('Failed to create notification:', error);
    }
    return result;
};
const getAllParcelsFromDB = async (query, user) => {
    const parcelSearchableFields = ['parcel_id', 'parcel_name'];
    const queryObj = { ...query };
    if (Object.hasOwn(queryObj, 'search')) {
        if (queryObj.search) {
            queryObj.searchTerm = queryObj.search;
        }
        delete queryObj.search;
    }
    if (user.role === user_interface_1.USER_ROLE.CUSTOMER) {
        queryObj.user_id = user.user_id;
    }
    const parcelQuery = new query_builder_1.default(parcel_model_1.Parcel.find().populate('user_id accepted_by'), queryObj)
        .search(parcelSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await parcelQuery.modelQuery;
    const meta = await parcelQuery.countTotal();
    return {
        meta,
        data,
    };
};
const getMyParcelsFromDB = async (query, userId, role) => {
    const parcelSearchableFields = ['parcel_id', 'parcel_name'];
    const queryObj = { ...query };
    if (queryObj.search) {
        queryObj.searchTerm = queryObj.search;
        delete queryObj.search;
    }
    if (role === user_interface_1.USER_ROLE.CUSTOMER) {
        queryObj.user_id = userId;
    }
    else if (role === user_interface_1.USER_ROLE.DRIVER) {
        queryObj.accepted_by = userId;
    }
    const parcelQuery = new query_builder_1.default(parcel_model_1.Parcel.find().populate('user_id accepted_by'), queryObj)
        .search(parcelSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await parcelQuery.modelQuery;
    const meta = await parcelQuery.countTotal();
    return { meta, data };
};
const getSingleParcelFromDB = async (id) => {
    const result = await parcel_model_1.Parcel.findById(id).populate('user_id accepted_by price_requests review');
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    return result;
};
const updateParcelInDB = async (id, payload) => {
    // 1. Fetch the existing parcel
    const existingParcel = await parcel_model_1.Parcel.findById(id);
    if (!existingParcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    // 2. CRITICAL: Only allow update if status is INITIAL
    if (existingParcel.status !== parcel_interface_1.PARCEL_STATUS.INITIAL) {
        throw new app_error_1.default(http_status_1.default.FORBIDDEN, `Cannot update parcel. Updates are only allowed when status is '${parcel_interface_1.PARCEL_STATUS.INITIAL}'.`);
    }
    // 3. Prevent direct update of restricted fields
    const restrictedFields = [
        'final_price',
        'price_status',
        'parcel_id',
        'status',
        'user_id',
    ];
    restrictedFields.forEach((field) => delete payload[field]);
    // 4. Handle Image Sync (Deletion of removed images)
    let finalParcelImages = existingParcel.parcel_images || [];
    if (payload.existing_parcel_images) {
        // Identify images that were in the DB but are NOT in the 'keep' list
        const imagesToDelete = existingParcel.parcel_images.filter((img) => !payload.existing_parcel_images?.includes(img));
        // Physically delete them from the local folder
        imagesToDelete.forEach((img) => (0, deleteFromS3_1.deleteFileFromS3)(img));
        // Update our array to contain only the kept images
        finalParcelImages = payload.existing_parcel_images;
    }
    // 5. Add new uploaded images
    if (payload.parcel_images && payload.parcel_images.length > 0) {
        finalParcelImages = [...finalParcelImages, ...payload.parcel_images];
    }
    // Assign the finalized image list back to the payload
    payload.parcel_images = finalParcelImages;
    delete payload.existing_parcel_images; // Clean up the helper field
    // 6. Update the database
    const result = await parcel_model_1.Parcel.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const rejectParcelFromDB = async (id, payload) => {
    const parcel = await parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    // Optional: Check if the parcel is already in a state that cannot be rejected
    if (parcel.status !== parcel_interface_1.PARCEL_STATUS.WAITING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, `Cannot reject a parcel that is already ${parcel.status.toLowerCase()}`);
    }
    const result = await parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.PARCEL_STATUS.REJECTED,
        rejection_reason: payload.rejection_reason,
    }, {
        new: true,
        runValidators: true,
    });
    return result;
};
const requestForPriceInDB = async (id) => {
    const parcel = await parcel_model_1.Parcel.findById(id);
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    // Optional: Check if the parcel is already in a state that cannot be rejected
    if (parcel.status !== parcel_interface_1.PARCEL_STATUS.INITIAL) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, `Cannot request price for a parcel that is already ${parcel.status.toLowerCase()}`);
    }
    const result = await parcel_model_1.Parcel.findByIdAndUpdate(id, {
        status: parcel_interface_1.PARCEL_STATUS.WAITING,
    }, {
        new: true,
        runValidators: true,
        select: 'status',
    });
    return result;
};
// ** ---------- Price Negotiation  ----------
const proposePriceInDB = async (role, payload // This matches your createPriceRequestValidationSchema
) => {
    // 1. Verify the Parcel exists
    const parcel = await parcel_model_1.Parcel.findById(payload.parcel_id);
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    if (parcel.status !== parcel_interface_1.PARCEL_STATUS.WAITING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'You can only propose a price when the parcel is in WAITING status.');
    }
    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const currentStatus = parcel.price_status;
    let newPriceStatus = currentStatus;
    let isFinalOffer = false;
    // 2. Logic to determine status changes
    if (isAdmin) {
        if (currentStatus === parcel_interface_1.PRICE_STATUS.NOT_SET ||
            currentStatus === parcel_interface_1.PRICE_STATUS.REJECTED) {
            newPriceStatus = parcel_interface_1.PRICE_STATUS.PROPOSED;
        }
        else if (currentStatus === parcel_interface_1.PRICE_STATUS.COUNTERED) {
            newPriceStatus = parcel_interface_1.PRICE_STATUS.FINAL_OFFER;
            isFinalOffer = true;
        }
        else {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, `Admin cannot propose price when status is ${currentStatus}`);
        }
    }
    else {
        // CUSTOMER LOGIC
        if (currentStatus === parcel_interface_1.PRICE_STATUS.PROPOSED) {
            newPriceStatus = parcel_interface_1.PRICE_STATUS.COUNTERED;
        }
        else if (currentStatus === parcel_interface_1.PRICE_STATUS.FINAL_OFFER) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This is the final offer. You can only Accept or Reject.');
        }
        else {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'You cannot propose a price at this stage.');
        }
    }
    // 3. Create the Price Request (Simplified: No session, No array)
    // This aligns with your PriceRequestSchema
    const priceRequest = await parcel_model_1.ParcelPriceRequest.create({
        parcel_id: payload.parcel_id,
        price_type: 'PROPOSED',
        proposed_price: payload.proposed_price,
        message: payload.message || '',
        proposed_by: isAdmin ? parcel_interface_1.PROPOSED_BY.ADMIN : parcel_interface_1.PROPOSED_BY.CUSTOMER,
        is_final_offer: isFinalOffer,
        status: parcel_interface_1.PRICE_REQUEST_STATUS.PENDING,
    });
    // 4. Update the Parcel price_status
    await parcel_model_1.Parcel.findByIdAndUpdate(payload.parcel_id, { price_status: newPriceStatus }, { new: true });
    // Create notification for price proposal/counter-offer
    try {
        // Determine notification type and recipient
        let type = notification_constant_1.NOTIFICATION_TYPE.PRICE_PROPOSED;
        if (newPriceStatus === parcel_interface_1.PRICE_STATUS.COUNTERED ||
            newPriceStatus === parcel_interface_1.PRICE_STATUS.FINAL_OFFER) {
            type = notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED;
        }
        // If Admin proposed, notify Customer (parcel owner)
        // If Customer proposed, we might notify Admin (if there's a specific admin user or system notification)
        // For now, let's assume we notify the "other party"
        // Only notify if there is a clear recipient.
        // If Admin proposed -> Notify Parcel Owner (Customer)
        if (isAdmin) {
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: parcel.user_id, // Notify the customer
                type: type,
                title: type === notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED
                    ? 'Price Counter Offer'
                    : 'Price Proposed',
                message: type === notification_constant_1.NOTIFICATION_TYPE.PRICE_COUNTERED
                    ? `A counter offer of $${payload.proposed_price} has been made for your parcel "${parcel.parcel_name}".`
                    : `A price of $${payload.proposed_price} has been proposed for your parcel "${parcel.parcel_name}".`,
                parcel_id: parcel._id,
                price_request_id: priceRequest._id,
                data: {
                    parcel_name: parcel.parcel_name,
                    price: payload.proposed_price,
                    is_final: isFinalOffer,
                },
            });
        }
        else {
            // If Customer proposed -> Notify Admin
            // Since there might be multiple admins, we might iterate or send to a general system channel
            // For this implementation, we'll skip direct Admin notification unless there's a specific Admin ID linked
            // Or we could broadcast to an admin room via socket directly, but here we create a DB notification for a "System" or "Super Admin"
            // Ideally you'd find a specific admin or have a system-wide notification mechanism
            // omitted for Customer -> Admin to avoid spamming all admins or if no specific admin is assigned
        }
    }
    catch (error) {
        console.error('Failed to create notification:', error);
    }
    return priceRequest;
};
// **  Accepting  price proposal
const acceptPriceProposalInDB = async (requestId, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const priceRequest = await parcel_model_1.ParcelPriceRequest.findById(requestId).session(session);
        if (!priceRequest) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Request not found!');
        }
        if (priceRequest.status !== parcel_interface_1.PRICE_REQUEST_STATUS.PENDING) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This proposal has already been decided!');
        }
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        const userRoleType = isAdmin ? parcel_interface_1.PROPOSED_BY.ADMIN : parcel_interface_1.PROPOSED_BY.CUSTOMER;
        if (priceRequest.proposed_by === userRoleType) {
            throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'You cannot respond to your own proposal.');
        }
        priceRequest.status = parcel_interface_1.PRICE_REQUEST_STATUS.ACCEPTED;
        priceRequest.decided_at = new Date();
        await priceRequest.save({ session });
        const updatedParcel = await parcel_model_1.Parcel.findByIdAndUpdate(priceRequest.parcel_id, {
            final_price: priceRequest.proposed_price,
            price_status: parcel_interface_1.PRICE_STATUS.ACCEPTED,
            status: parcel_interface_1.PARCEL_STATUS.PENDING,
        }, { session, new: true });
        if (!updatedParcel) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Associated parcel not found!');
        }
        await session.commitTransaction();
        try {
            const notifyUserId = priceRequest.proposed_by === parcel_interface_1.PROPOSED_BY.CUSTOMER
                ? updatedParcel.user_id
                : priceRequest.proposed_by;
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: notifyUserId,
                type: notification_constant_1.NOTIFICATION_TYPE.PRICE_ACCEPTED,
                title: 'Price Accepted',
                message: `The price of $${priceRequest.proposed_price} for parcel "${updatedParcel.parcel_name}" has been accepted.`,
                parcel_id: updatedParcel._id,
                price_request_id: priceRequest._id,
                data: {
                    parcel_name: updatedParcel.parcel_name,
                    price: priceRequest.proposed_price,
                },
            });
        }
        catch (error) {
            console.error('Failed to create notification:', error);
        }
        return priceRequest;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        await session.endSession();
    }
};
// ** Rejecting price proposal
const rejectPriceProposalInDB = async (requestId, user) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const priceRequest = await parcel_model_1.ParcelPriceRequest.findById(requestId).session(session);
        if (!priceRequest) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Request not found!');
        }
        if (priceRequest.status !== parcel_interface_1.PRICE_REQUEST_STATUS.PENDING) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This proposal has already been decided!');
        }
        const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
        const userRoleType = isAdmin ? parcel_interface_1.PROPOSED_BY.ADMIN : parcel_interface_1.PROPOSED_BY.CUSTOMER;
        if (priceRequest.proposed_by === userRoleType) {
            throw new app_error_1.default(http_status_1.default.FORBIDDEN, 'You cannot respond to your own proposal.');
        }
        priceRequest.status = 'REJECTED';
        priceRequest.decided_at = new Date();
        await priceRequest.save({ session });
        const updatedParcel = await parcel_model_1.Parcel.findByIdAndUpdate(priceRequest.parcel_id, {
            price_status: parcel_interface_1.PRICE_STATUS.REJECTED,
            status: parcel_interface_1.PARCEL_STATUS.REJECTED,
        }, { session, new: true });
        if (!updatedParcel) {
            throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Associated parcel not found!');
        }
        await session.commitTransaction();
        return priceRequest;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        await session.endSession();
    }
};
const rejectAndCounterPriceInDB = async (requestId, payload) => {
    const currentRequest = await parcel_model_1.ParcelPriceRequest.findById(requestId);
    const parcel = await parcel_model_1.Parcel.findById(payload.parcel_id);
    if (!currentRequest) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Price request not found!');
    }
    if (currentRequest.status !== parcel_interface_1.PRICE_REQUEST_STATUS.PENDING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, `This price request has already been ${currentRequest.status.toLowerCase()}`);
    }
    if (!parcel) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Parcel not found!');
    }
    currentRequest.status = parcel_interface_1.PRICE_REQUEST_STATUS.REJECTED;
    currentRequest.rejection_reason = payload.rejection_reason;
    currentRequest.decided_at = new Date();
    await currentRequest.save();
    const newCounterOffer = await parcel_model_1.ParcelPriceRequest.create({
        parcel_id: payload.parcel_id,
        proposed_by: parcel_interface_1.PROPOSED_BY.CUSTOMER,
        price_type: 'COUNTERED',
        proposed_price: payload.suggested_price,
        status: parcel_interface_1.PRICE_REQUEST_STATUS.PENDING,
    });
    await parcel_model_1.Parcel.findByIdAndUpdate(payload.parcel_id, { price_status: parcel_interface_1.PRICE_STATUS.COUNTERED }, { new: true });
    return newCounterOffer;
};
const adminRejectAndFinalOfferInDB = async (requestId, payload) => {
    const customerRequest = await parcel_model_1.ParcelPriceRequest.findById(requestId);
    if (!customerRequest) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Counter offer not found');
    }
    if (customerRequest.status !== parcel_interface_1.PRICE_REQUEST_STATUS.PENDING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, `This price request has already been ${customerRequest.status.toLowerCase()}`);
    }
    customerRequest.status = parcel_interface_1.PRICE_REQUEST_STATUS.REJECTED;
    customerRequest.rejection_reason = payload?.message ?? null;
    customerRequest.decided_at = new Date();
    await customerRequest.save();
    const finalOffer = await parcel_model_1.ParcelPriceRequest.create({
        parcel_id: payload.parcel_id,
        proposed_by: parcel_interface_1.PROPOSED_BY.ADMIN,
        price_type: 'FINAL_OFFER',
        proposed_price: payload.final_price,
        message: payload.message || 'This is our final offer.',
        is_final_offer: true,
        status: parcel_interface_1.PRICE_REQUEST_STATUS.PENDING,
    });
    await parcel_model_1.Parcel.findByIdAndUpdate(payload.parcel_id, {
        price_status: parcel_interface_1.PRICE_STATUS.FINAL_OFFER,
    });
    return finalOffer;
};
exports.ParcelServices = {
    createParcelIntoDB,
    getAllParcelsFromDB,
    getMyParcelsFromDB,
    getSingleParcelFromDB,
    updateParcelInDB,
    rejectParcelFromDB,
    requestForPriceInDB,
    proposePriceInDB,
    acceptPriceProposalInDB,
    rejectAndCounterPriceInDB,
    adminRejectAndFinalOfferInDB,
    rejectPriceProposalInDB,
};
//# sourceMappingURL=parcel.service.js.map
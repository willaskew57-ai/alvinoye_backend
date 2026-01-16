import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../../../builders/QueryBuilder';
import AppError from '../../../../errors/app-error';
import { USER_ROLE } from '../user/user.interface';
import { Parcel, ParcelPriceRequest } from './parcel.model';
import {
  PARCEL_STATUS,
  PRICE_REQUEST_STATUS,
  PRICE_STATUS,
  PROPOSED_BY,
  type TParcel,
  type TParcelPriceRequest,
  type TParcelStatus,
  type TPriceRequestStatus,
} from './parcel.interface';
import type { TUserPayload } from '../../../../interfaces';
import { generateParcelId } from './parcel.utils';
import { getIO } from '../../../../socket';

// ** ----- create parcel -----
const createParcelIntoDB = async (userId: string, payload: TParcel) => {
  const parcelData = {
    ...payload,
    user_id: userId,
    parcel_id: generateParcelId(),
    status: 'WAITING' as TParcelStatus,
    price_status: 'NOT_SET' as TPriceRequestStatus,
  };

  const result = await Parcel.create(parcelData);
  
  return result;
};

const getAllParcelsFromDB = async (
  query: Record<string, unknown>,
  user: TUserPayload
) => {
  const parcelSearchableFields = [
    'parcel_id',
    'parcel_name',
    'receiver_phone',
    'receiver_name',
  ];

  const queryObj = { ...query };

  if (queryObj.search) {
    queryObj.searchTerm = queryObj.search;
    delete queryObj.search;
  }

  if (user.role === USER_ROLE.CUSTOMER) {
    queryObj.user_id = user.user_id;
  }

  const parcelQuery = new QueryBuilder(
    Parcel.find().populate('user_id accepted_by'),
    queryObj
  )
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

const getMyParcelsFromDB = async (
  query: Record<string, unknown>,
  userId: string,
  role: string
) => {
  const parcelSearchableFields = ['parcel_id', 'parcel_name'];
  const queryObj = { ...query };

  if (queryObj.search) {
    queryObj.searchTerm = queryObj.search;
    delete queryObj.search;
  }

  if (role === USER_ROLE.CUSTOMER) {
    queryObj.user_id = userId;
  } else if (role === USER_ROLE.DRIVER) {
    queryObj.accepted_by = userId;
  }

  const parcelQuery = new QueryBuilder(
    Parcel.find().populate('user_id accepted_by'),
    queryObj
  )
    .search(parcelSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await parcelQuery.modelQuery;
  const meta = await parcelQuery.countTotal();

  return { meta, data };
};

const getSingleParcelFromDB = async (id: string) => {
  const result = await Parcel.findById(id).populate(
    'user_id accepted_by price_requests'
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }
  return result;
};

const updateParcelInDB = async (id: string, payload: Partial<TParcel>) => {
  // Prevent direct update of price or status via this general update method
  const restrictedFields = ['final_price', 'price_status', 'parcel_id'];
  restrictedFields.forEach((field) => delete (payload as any)[field]);

  const result = await Parcel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }
  return result;
};

// ** --- Price Negotiation  ---

const proposePriceInDB = async (
  userId: string,
  role: string,
  payload: Partial<TParcelPriceRequest>
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const parcel = await Parcel.findById(payload.parcel_id).session(session);
    if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');

    const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const currentStatus = parcel.price_status;

    let newPriceStatus = currentStatus;
    let isFinalOffer = false;

    // --- STATE VALIDATION LOGIC ---

    if (isAdmin) {
      if (
        currentStatus === PRICE_STATUS.NOT_SET ||
        currentStatus === PRICE_STATUS.REJECTED
      ) {
        // First time Admin sets price
        newPriceStatus = PRICE_STATUS.PROPOSED;
      } else if (currentStatus === PRICE_STATUS.COUNTERED) {
        // Admin responding to User's counter - this is the FINAL offer
        newPriceStatus = PRICE_STATUS.FINAL_OFFER;
        isFinalOffer = true;
      } else {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Admin cannot propose price when status is ${currentStatus}`
        );
      }
    } else {
      // CUSTOMER LOGIC
      if (currentStatus === PRICE_STATUS.PROPOSED) {
        // Customer countering Admin's first price
        newPriceStatus = PRICE_STATUS.COUNTERED;
      } else if (currentStatus === PRICE_STATUS.FINAL_OFFER) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'This is the final offer. You can only Accept or Reject.'
        );
      } else {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'You cannot propose a price at this stage.'
        );
      }
    }

    // 1. Create the Price Request
    const priceRequest = await ParcelPriceRequest.create(
      [
        {
          ...payload,
          proposed_by: isAdmin ? PROPOSED_BY.ADMIN : PROPOSED_BY.CUSTOMER,
          is_final_offer: isFinalOffer,
          status: PRICE_REQUEST_STATUS.PENDING,
        },
      ],
      { session }
    );

    // 2. Update Parcel State
    await Parcel.findByIdAndUpdate(
      payload.parcel_id,
      { price_status: newPriceStatus },
      { session }
    );

    await session.commitTransaction();
    return priceRequest[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

// **  Accepting  price proposal
const acceptPriceProposalInDB = async (
  requestId: string,
  status: TPriceRequestStatus,
  user: { user_id: string; role: string }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const priceRequest = await ParcelPriceRequest.findById(requestId).session(
      session
    );
    if (!priceRequest)
      throw new AppError(httpStatus.NOT_FOUND, 'Request not found!');
    if (priceRequest.status !== PRICE_REQUEST_STATUS.PENDING) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This proposal has already been decided!'
      );
    }

    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
    const userRoleType = isAdmin ? PROPOSED_BY.ADMIN : PROPOSED_BY.CUSTOMER;

    // Check: Cannot respond to your own proposal
    if (priceRequest.proposed_by === userRoleType) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You cannot respond to your own proposal.'
      );
    }

    // Update Request
    priceRequest.status = status;
    priceRequest.decided_at = new Date();

    await priceRequest.save({ session });

    // Update Parcel
    const updatedParcel = await Parcel.findByIdAndUpdate(
      priceRequest.parcel_id,
      {
        final_price: priceRequest.proposed_price,
        price_status: PRICE_STATUS.ACCEPTED,
        status: PARCEL_STATUS.PENDING,
      },
      { session, new: true }
    );

    if (!updatedParcel) {
      throw new AppError(httpStatus.NOT_FOUND, 'Associated parcel not found!');
    }

    await session.commitTransaction();
    return priceRequest;
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

/**
 * Logic: CUSTOMER Rejects Admin's price and suggests their own (Popup)
 */
const rejectAndCounterPriceInDB = async (
  requestId: string,
  payload: {
    parcel_id: string;
    rejection_reason: string;
    suggested_price: number;
  }
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1Mark Admin's previous proposal as REJECTED
    const currentRequest = await ParcelPriceRequest.findById(requestId).session(
      session
    );
    if (!currentRequest)
      throw new AppError(httpStatus.NOT_FOUND, 'Price request not found!');

    currentRequest.status = PRICE_REQUEST_STATUS.REJECTED;
    currentRequest.rejection_reason = payload.rejection_reason;
    currentRequest.decided_at = new Date();
    await currentRequest.save({ session });

    // Create the Customer's Counter Proposal
    const newCounterOffer = await ParcelPriceRequest.create(
      [
        {
          parcel_id: payload.parcel_id,
          proposed_by: PROPOSED_BY.CUSTOMER,
          proposed_price: payload.suggested_price,
          message: payload.rejection_reason,
          status: PRICE_REQUEST_STATUS.PENDING,
        },
      ],
      { session }
    );

    // Update Parcel state to COUNTERED
    await Parcel.findByIdAndUpdate(
      payload.parcel_id,
      { price_status: PRICE_STATUS.COUNTERED },
      { session }
    );

    await session.commitTransaction();
    return newCounterOffer[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

/**
 * ADMIN Rejects Customer's price and sets the TAKE-IT-OR-LEAVE-IT price
 */
const adminRejectAndFinalOfferInDB = async (
  requestId: string,
  payload: {
    parcel_id: string;
    final_price: number;
    message?: string;
  }
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Mark Customer's counter-offer as REJECTED
    const customerRequest = await ParcelPriceRequest.findById(
      requestId
    ).session(session);
    if (!customerRequest)
      throw new AppError(httpStatus.NOT_FOUND, 'Counter offer not found');

    customerRequest.status = PRICE_REQUEST_STATUS.REJECTED;
    customerRequest.decided_at = new Date();
    await customerRequest.save({ session });

    // Create Admin's FINAL proposal
    const finalOffer = await ParcelPriceRequest.create(
      [
        {
          parcel_id: payload.parcel_id,
          proposed_by: PROPOSED_BY.ADMIN,
          proposed_price: payload.final_price,
          message: payload.message || 'This is our final offer.',
          is_final_offer: true,
          status: PRICE_REQUEST_STATUS.PENDING,
        },
      ],
      { session }
    );

    // Update Parcel state to FINAL_OFFER
    await Parcel.findByIdAndUpdate(
      payload.parcel_id,
      { price_status: PRICE_STATUS.FINAL_OFFER },
      { session }
    );

    await session.commitTransaction();
    return finalOffer[0];
  } catch (err: any) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const ParcelServices = {
  createParcelIntoDB,
  getAllParcelsFromDB,
  getMyParcelsFromDB,
  getSingleParcelFromDB,
  updateParcelInDB,
  proposePriceInDB,
  acceptPriceProposalInDB,
  rejectAndCounterPriceInDB,
  adminRejectAndFinalOfferInDB,
};

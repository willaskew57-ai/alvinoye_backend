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
  type TParcel,
  type TParcelPriceRequest,
  type TParcelStatus,
  type TPriceRequestStatus,
} from './parcel.interface';
import type { TUserPayload } from '../../../../interfaces';
import { generateParcelId } from './parcel.utils';

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
  const parcelSearchableFields = ['parcel_id', 'parcel_name'];

  const queryObj = { ...query };

  // If the user is a Customer, they can only see their own parcels
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

// --- Price Negotiation Logic (Using Transactions) ---

const proposePriceInDB = async (
  userId: string,
  role: string,
  payload: TParcelPriceRequest
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const parcel = await Parcel.findById(payload.parcel_id).session(session);
    if (!parcel) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
    }

    // Determine who is proposing
    const proposedBy =
      role === USER_ROLE.ADMIN || role === USER_ROLE.SUPER_ADMIN
        ? 'ADMIN'
        : 'CUSTOMER';

    const priceRequest = await ParcelPriceRequest.create(
      [
        {
          ...payload,
          proposed_by: proposedBy,
          status: 'PENDING' as TPriceRequestStatus,
        },
      ],
      { session }
    );

    const priceStatus = proposedBy === 'ADMIN' ? 'PROPOSED' : 'COUNTED';
    await Parcel.findByIdAndUpdate(
      payload.parcel_id,
      { price_status: priceStatus },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return priceRequest[0];
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

// Updated Service
export const respondToPriceProposalInDB = async (
  requestId: string,
  status: TPriceRequestStatus,
  user: { user_id: string; role: string }, // Pass full user object
  rejection_reason?: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const priceRequest = await ParcelPriceRequest.findById(requestId).session(session);
    if (!priceRequest) {
      throw new AppError(httpStatus.NOT_FOUND, 'Price request record not found!');
    }

    if (priceRequest.status !== PRICE_REQUEST_STATUS.PENDING) {
      throw new AppError(httpStatus.BAD_REQUEST, 'This proposal has already been decided!');
    }

    /**
     * BUSINESS RULE: A user cannot respond to their own proposal.
     * If Admin proposed, only Customer can respond.
     * If Customer proposed, only Admin can respond.
     */
    if (priceRequest.proposed_by === user.role) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `As an ${user.role}, you cannot accept or reject your own price proposal.`
      );
    }

    /**
     * BUSINESS RULE: Rejection reason is mandatory for REJECTED status.
     */
    if (status === PRICE_REQUEST_STATUS.REJECTED && !rejection_reason) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please provide a reason for rejecting this price proposal.'
      );
    }

    // 2. Update the Price Request status
    priceRequest.status = status;
    priceRequest.decided_at = new Date();
    if (status === PRICE_REQUEST_STATUS.REJECTED) {
      priceRequest.message = `REJECTION REASON: ${rejection_reason}`;
    }
    await priceRequest.save({ session });

    // 3. Update the Parcel table
    if (status === PRICE_REQUEST_STATUS.ACCEPTED) {
      const updatedParcel = await Parcel.findByIdAndUpdate(
        priceRequest.parcel_id,
        {
          final_price: priceRequest.proposed_price,
          price_status: PRICE_STATUS.ACCEPTED,
          status: PARCEL_STATUS.PENDING,
          accepted_by: user.user_id,
          accepted_at: new Date(),
        },
        { session, new: true }
      );

      if (!updatedParcel) {
        throw new AppError(httpStatus.NOT_FOUND, 'Associated parcel not found!');
      }
    } else {
      // If REJECTED
      await Parcel.findByIdAndUpdate(
        priceRequest.parcel_id,
        { price_status: PRICE_STATUS.REJECTED },
        { session }
      );
    }

    await session.commitTransaction();
    return priceRequest;
  } catch (err: any) {
    await session.abortTransaction();
    throw err instanceof AppError ? err : new AppError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  } finally {
    await session.endSession();
  }
};

const getPriceHistoryFromDB = async (parcelId: string) => {
  const result = await ParcelPriceRequest.find({ parcel_id: parcelId }).sort({
    createdAt: -1,
  });
  return result;
};

export const ParcelServices = {
  createParcelIntoDB,
  getAllParcelsFromDB,
  getSingleParcelFromDB,
  updateParcelInDB,
  proposePriceInDB,
  respondToPriceProposalInDB,
  getPriceHistoryFromDB,
};

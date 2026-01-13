import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../../../builders/QueryBuilder';
import AppError from '../../../../errors/app-error';
import { USER_ROLE } from '../user/user.interface';
import { Parcel, ParcelPriceRequest } from './parcel.model';
import type { TParcel, TParcelPriceRequest } from './parcel.interface';
import type { TUserPayload } from '../../../../interfaces';

/**
 * Generate a unique human-readable Parcel ID (e.g., PC-1715432)
 */
const generateParcelId = () => {
  const datePart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `PC-${datePart}${randomPart}`;
};

// --- Standard CRUD Services ---

const createParcelIntoDB = async (userId: string, payload: TParcel) => {
  const parcelData = {
    ...payload,
    user_id: userId,
    parcel_id: generateParcelId(),
    status: 'Waiting',
    price_status: 'NotSet',
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
    'receiver_name',
    'receiver_phone',
    'handover_location',
  ];

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
  const result = await Parcel.findById(id).populate('user_id accepted_by');
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
        ? 'Admin'
        : 'Customer';

    // 1. Create the price request log
    const priceRequest = await ParcelPriceRequest.create(
      [
        {
          ...payload,
          proposed_by: proposedBy,
          status: 'Pending',
        },
      ],
      { session }
    );

    // 2. Update the main Parcel table status
    const priceStatus = proposedBy === 'Admin' ? 'Proposed' : 'Countered';
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

const respondToPriceProposalInDB = async (
  requestId: string,
  status: 'Accepted' | 'Rejected',
  userId: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Find the specific price request
    const priceRequest = await ParcelPriceRequest.findById(requestId).session(
      session
    );
    if (!priceRequest) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Price request record not found!'
      );
    }

    if (priceRequest.status !== 'Pending') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This proposal is already decided!'
      );
    }

    // 2. Update the request status
    priceRequest.status = status;
    priceRequest.decided_at = new Date();
    await priceRequest.save({ session });

    // 3. Update the Parcel table based on the decision
    if (status === 'Accepted') {
      await Parcel.findByIdAndUpdate(
        priceRequest.parcel_id,
        {
          final_price: priceRequest.proposed_price,
          price_status: 'Accepted',
          status: 'Pending', // Once price is fixed, it moves to Pending for fulfillment
          accepted_by: userId,
          accepted_at: new Date(),
        },
        { session }
      );
    } else {
      await Parcel.findByIdAndUpdate(
        priceRequest.parcel_id,
        { price_status: 'Rejected' },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return priceRequest;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
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

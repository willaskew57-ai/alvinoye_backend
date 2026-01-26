import httpStatus from 'http-status';
import mongoose from 'mongoose';
import QueryBuilder from '../../../../builders/query-builder';
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
import { deleteLocalFile } from '../../../../utils/deleteFileHelper';

// ** ----- create parcel -----
// parcel.service.ts
const createParcelIntoDB = async (userId: string, payload: TParcel) => {
  const parcelData = {
    ...payload,
    user_id: userId,
    parcel_id: generateParcelId(), // Ensure you have this helper
    status: 'INITIAL' as TParcelStatus,
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

  if (Object.hasOwn(queryObj, 'search')) {
    if (queryObj.search) {
      queryObj.searchTerm = queryObj.search;
    }
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
    'user_id accepted_by price_requests review'
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }
  return result;
};

const updateParcelInDB = async (
  id: string,
  payload: Partial<TParcel> & { existing_parcel_images?: string[] }
) => {
  // 1. Fetch the existing parcel
  const existingParcel = await Parcel.findById(id);

  if (!existingParcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  // 2. CRITICAL: Only allow update if status is INITIAL
  if (existingParcel.status !== PARCEL_STATUS.INITIAL) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `Cannot update parcel. Updates are only allowed when status is '${PARCEL_STATUS.INITIAL}'.`
    );
  }

  // 3. Prevent direct update of restricted fields
  const restrictedFields = [
    'final_price',
    'price_status',
    'parcel_id',
    'status',
    'user_id',
  ];
  restrictedFields.forEach((field) => delete (payload as any)[field]);

  // 4. Handle Image Sync (Deletion of removed images)
  let finalParcelImages = existingParcel.parcel_images || [];

  if (payload.existing_parcel_images) {
    // Identify images that were in the DB but are NOT in the 'keep' list
    const imagesToDelete = existingParcel.parcel_images.filter(
      (img: string) => !payload.existing_parcel_images?.includes(img)
    );

    // Physically delete them from the local folder
    imagesToDelete.forEach((img: string) => deleteLocalFile(img));

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
  const result = await Parcel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const rejectParcelFromDB = async (
  id: string,
  payload: { rejection_reason: string }
) => {
  const parcel = await Parcel.findById(id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  // Optional: Check if the parcel is already in a state that cannot be rejected
  if (parcel.status !== PARCEL_STATUS.WAITING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot reject a parcel that is already ${parcel.status.toLowerCase()}`
    );
  }

  const result = await Parcel.findByIdAndUpdate(
    id,
    {
      status: PARCEL_STATUS.REJECTED,
      rejection_reason: payload.rejection_reason,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

const requestForPriceInDB = async (id: string) => {
  const parcel = await Parcel.findById(id);

  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  // Optional: Check if the parcel is already in a state that cannot be rejected
  if (parcel.status !== PARCEL_STATUS.INITIAL) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot request price for a parcel that is already ${parcel.status.toLowerCase()}`
    );
  }

  const result = await Parcel.findByIdAndUpdate(
    id,
    {
      status: PARCEL_STATUS.WAITING,
    },
    {
      new: true,
      runValidators: true,
      select: 'status',
    }
  );

  return result;
};

// ** ---------- Price Negotiation  ----------

const proposePriceInDB = async (
  role: string,
  payload: any // This matches your createPriceRequestValidationSchema
) => {
  // 1. Verify the Parcel exists
  const parcel = await Parcel.findById(payload.parcel_id);
  if (!parcel) {
    throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found!');
  }

  if (parcel.status !== PARCEL_STATUS.WAITING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'You can only propose a price when the parcel is in WAITING status.'
    );
  }

  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  const currentStatus = parcel.price_status;

  let newPriceStatus = currentStatus;
  let isFinalOffer = false;

  // 2. Logic to determine status changes
  if (isAdmin) {
    if (
      currentStatus === PRICE_STATUS.NOT_SET ||
      currentStatus === PRICE_STATUS.REJECTED
    ) {
      newPriceStatus = PRICE_STATUS.PROPOSED;
    } else if (currentStatus === PRICE_STATUS.COUNTERED) {
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

  // 3. Create the Price Request (Simplified: No session, No array)
  // This aligns with your PriceRequestSchema
  const priceRequest = await ParcelPriceRequest.create({
    parcel_id: payload.parcel_id,
    price_type: 'PROPOSED',
    proposed_price: payload.proposed_price,
    message: payload.message || '',
    proposed_by: isAdmin ? PROPOSED_BY.ADMIN : PROPOSED_BY.CUSTOMER,
    is_final_offer: isFinalOffer,
    status: PRICE_REQUEST_STATUS.PENDING,
  });

  // 4. Update the Parcel price_status
  await Parcel.findByIdAndUpdate(
    payload.parcel_id,
    { price_status: newPriceStatus },
    { new: true }
  );

  return priceRequest;
};

// **  Accepting  price proposal
const acceptPriceProposalInDB = async (
  requestId: string,
  user: { user_id: string; role: string }
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const priceRequest =
      await ParcelPriceRequest.findById(requestId).session(session);
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
    priceRequest.status = 'ACCEPTED';
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
  const currentRequest = await ParcelPriceRequest.findById(requestId);

  if (!currentRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Price request not found!');
  }

  if (currentRequest.status !== PRICE_REQUEST_STATUS.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This price request has already been ${currentRequest.status.toLowerCase()}`
    );
  }

  currentRequest.status = PRICE_REQUEST_STATUS.REJECTED;
  currentRequest.rejection_reason = payload.rejection_reason;
  currentRequest.decided_at = new Date();
  await currentRequest.save();

  const newCounterOffer = await ParcelPriceRequest.create({
    parcel_id: payload.parcel_id,
    proposed_by: PROPOSED_BY.CUSTOMER,
    price_type: 'COUNTERED',
    proposed_price: payload.suggested_price,
    status: PRICE_REQUEST_STATUS.PENDING,
  });

  await Parcel.findByIdAndUpdate(
    payload.parcel_id,
    { price_status: PRICE_STATUS.COUNTERED },
    { new: true }
  );

  return newCounterOffer;
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
  // 1. Mark Customer's counter-offer as REJECTED
  const customerRequest = await ParcelPriceRequest.findById(requestId);

  if (!customerRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Counter offer not found');
  }

  if (customerRequest.status !== PRICE_REQUEST_STATUS.PENDING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This price request has already been ${customerRequest.status.toLowerCase()}`
    );
  }

  customerRequest.status = PRICE_REQUEST_STATUS.REJECTED;
  customerRequest.rejection_reason = payload?.message ?? null;
  customerRequest.decided_at = new Date();

  // Save changes to the existing request
  await customerRequest.save();

  // 2. Create Admin's FINAL proposal
  // Note: Removed [ ] array and session. Now returns a single object.
  const finalOffer = await ParcelPriceRequest.create({
    parcel_id: payload.parcel_id,
    proposed_by: PROPOSED_BY.ADMIN,
    price_type: 'FINAL_OFFER',
    proposed_price: payload.final_price,
    message: payload.message || 'This is our final offer.',
    is_final_offer: true,
    status: PRICE_REQUEST_STATUS.PENDING,
  });

  // 3. Update Parcel state to FINAL_OFFER
  await Parcel.findByIdAndUpdate(payload.parcel_id, {
    price_status: PRICE_STATUS.FINAL_OFFER,
  });

  // Return the newly created offer directly
  return finalOffer;
};

export const ParcelServices = {
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
};

import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { User } from './user.model';
import {
  USER_ROLE,
  USER_STATUS,
  type TUser,
  type TUserStatus,
} from './user.interface';
import { Types } from 'mongoose';
import QueryBuilder from '../../../../builders/query-builder';
import { deleteFileFromS3 } from '../../../../aws/deleteFromS3';
import { deleteLocalFile } from '../../../../utils/deleteFileHelper';

const createAdminIntoDB = async (payload: TUser) => {
  const isUserExists = await User.isUserExistsByEmail(payload.email);

  if (isUserExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'User with this email already exists!'
    );
  }

  const userData = {
    ...payload,
    role: 'ADMIN',
    status: 'ACTIVE',
    is_profile_completed: true,
    is_verified: true,
  };
  const result = await User.create(userData);
  return result;
};

// ** ------------- User Status update Service -------------
const changeUserStatusInDB = async (
  targetId: string,
  payload: { status: TUserStatus },
  performerId: string,
  performerRole: string // From req.user.role
) => {
  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (performerRole === USER_ROLE.ADMIN) {
    const allowedRolesToManage = [USER_ROLE.CUSTOMER, USER_ROLE.DRIVER];

    if (!allowedRolesToManage.includes(targetUser.role as any)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Admins can only manage status for Customers and Drivers'
      );
    }
  }

  if (
    targetUser.status === USER_STATUS.ACTIVE &&
    payload.status === USER_STATUS.PENDING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot change status back to PENDING once a user is ACTIVE'
    );
  }

  const updateData: Partial<TUser> = {
    status: payload.status,
  };

  const adminObjectId = new Types.ObjectId(performerId);

  switch (payload.status) {
    case USER_STATUS.BLOCKED:
      updateData.blocked_by = adminObjectId;
      break;

    case USER_STATUS.ACTIVE:
      updateData.blocked_by = null;
      break;
  }

  const result = await User.findByIdAndUpdate(
    targetId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userSearchableFields = ['full_name', 'email', 'phone_number'];

  const baseQuery = User.find({
    role: { $in: [USER_ROLE.CUSTOMER, USER_ROLE.DRIVER] },
  });

  const userQuery = new QueryBuilder(baseQuery, query)
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await userQuery.modelQuery;

  const meta = await userQuery.countTotal();

  return {
    meta,
    data,
  };
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({ _id: id });

  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

  return result;
};

const getMeFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};


const updateMeIntoDB = async (id: string, payload: Partial<TUser>) => {
  // 1. Prevent users from updating sensitive fields
  const forbiddenFields: (keyof TUser)[] = [
    'role',
    'status',
    'email',
    'is_profile_completed',
  ];

  forbiddenFields.forEach((field) => {
    if (field in payload) {
      delete (payload as any)[field];
    }
  });

  // 2. Handle local file deletion if a new profile picture is provided
  if (payload.profile_picture) {
    const existingUser = await User.findById(id);

    // If user exists and already has a picture, delete the old one from local storage
    if (existingUser && existingUser.profile_picture) {
      deleteLocalFile(existingUser.profile_picture);
    }
  }

  // 3. Update the database
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  return result;
};

const updateUserInDB = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status: 'DELETED', deleted_date: new Date() },
    { new: true }
  );
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  return result;
};

export const UserServices = {
  createAdminIntoDB,
  changeUserStatusInDB,
  getAllUsersFromDB,
  getMeFromDB,
  updateMeIntoDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};

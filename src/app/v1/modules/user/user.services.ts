import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { User } from './user.model';
import type { TUser } from './user.interface';

const createUserIntoDB = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const filter: any = { is_deleted: false };

  // Filter by role if provided in query params (e.g., ?role=DRIVER)
  if (query?.role) {
    filter.role = query.role;
  }

  const result = await User.find(filter);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findOne({ _id: id, is_deleted: false });
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');

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
    { is_deleted: true, deleted_date: new Date() },
    { new: true }
  );
  if (!result) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};

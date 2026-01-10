import  httpStatus  from 'http-status';

// ** imports local files
import type { IPrivacyPolicy } from './settings.interface';
import PrivacyPolicy from './settings.model';
import AppError from '../../../../errors/app-error';

// ** create a new privacy policy
const createPrivacyPolicyIntoDB = async (payload: IPrivacyPolicy) => {
  try {
    const result = await PrivacyPolicy.create(payload);
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `Failed to create privacy policy: ${error.message}`
      );
    }
    throw new AppError(
      httpStatus.NOT_FOUND,
      'An unknown error occurred while creating the privacy policy'
    );
  }
};

// ** get privacy policy
const getPrivacyPolicyFromDB = async () => {
  const result = await PrivacyPolicy.findOne();
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Policy not found');
  }
  return result;
};

const updatePrivacyPolicyIntoDB = async (id: string, payload: Partial<IPrivacyPolicy>) => {
  const isPolicyExist = await PrivacyPolicy.findById(id);

  if (!isPolicyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Policy not found');
  }

  const result = await PrivacyPolicy.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  
  return result;
};

const deletePrivacyPolicyFromDB = async (id: string) => {
  const isPolicyExist = await PrivacyPolicy.findById(id);

  if (!isPolicyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Policy not found');
  }

  return await PrivacyPolicy.findByIdAndDelete(id);
};

export const SettingsServices = {
  createPrivacyPolicyIntoDB,
  getPrivacyPolicyFromDB,
  updatePrivacyPolicyIntoDB,
  deletePrivacyPolicyFromDB,
};

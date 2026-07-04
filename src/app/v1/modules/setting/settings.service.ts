import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { AboutUs, Faq, PrivacyPolicy, TermsCondition } from './settings.model';
import type {
  TFaq,
  TPrivacyPolicy,
  TTermsCondition,
  TAboutUs,
} from './settings.interface';

//** ----------------- Faq Services --------------
const createFaqInDB = async (payload: TFaq) => {
  const result = await Faq.create(payload);
  return result;
};

const getAllFaqsInDB = async () => {
  const result = await Faq.find();
  return result;
};

const getSingleFaqInDB = async (id: string) => {
  const result = await Faq.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

const updateFaqInDB = async (id: string, payload: Partial<TFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

const deleteFaqInDB = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

//** ----------------- Terms & Conditions Services --------------

const createTermsInDB = async (payload: TTermsCondition) => {
  const result = await TermsCondition.create(payload);
  return result;
};

const getSingleTermsInDB = async () => {
  const result = await TermsCondition.findOne().sort({ created_at: -1 });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Terms and Conditions not found');
  }
  return result;
};

const updateTermsInDB = async (
  id: string,
  payload: Partial<TTermsCondition>
) => {
  const result = await TermsCondition.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Terms and Conditions not found');
  }
  return result;
};

//** ----------------- Privacy Policy Services --------------

const createPrivacyInDB = async (payload: TPrivacyPolicy) => {
  const result = await PrivacyPolicy.create(payload);
  return result;
};

const getSinglePrivacyInDB = async () => {
  const result = await PrivacyPolicy.findOne().sort({ created_at: -1 });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
  }
  return result;
};

const updatePrivacyInDB = async (
  id: string,
  payload: Partial<TPrivacyPolicy>
) => {
  const result = await PrivacyPolicy.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
  }
  return result;
};

//** ----------------- About Us Services --------------

const createAboutInDB = async (payload: TAboutUs) => {
  const result = await AboutUs.create(payload);
  return result;
};

const getSingleAboutInDB = async () => {
  const result = await AboutUs.findOne().sort({ created_at: -1 });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'About Us not found');
  }
  return result;
};

const updateAboutInDB = async (id: string, payload: Partial<TAboutUs>) => {
  const result = await AboutUs.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'About Us not found');
  }
  return result;
};

//** ----------------- Exporting All Services --------------

export const SettingsService = {
  // Faq
  createFaqInDB,
  getAllFaqsInDB,
  getSingleFaqInDB,
  updateFaqInDB,
  deleteFaqInDB,

  // Terms 
  createTermsInDB,
  getSingleTermsInDB,
  updateTermsInDB,

  // Privacy
  createPrivacyInDB,
  getSinglePrivacyInDB,
  updatePrivacyInDB,

  // About Us
  createAboutInDB,
  getSingleAboutInDB,
  updateAboutInDB,
};

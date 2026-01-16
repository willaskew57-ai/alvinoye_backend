import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { Faq, PrivacyPolicy, TermsCondition } from './settings.model';
import type { TFaq, TPrivacyPolicy, TTermsCondition } from './settings.interface';

/** FAQ Services */
const createFaq = async (payload: TFaq) => {
  const result = await Faq.create(payload);
  return result;
};

const getAllFaqs = async () => {
  const result = await Faq.find();
  return result;
};

const updateFaq = async (id: string, payload: Partial<TFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, { 
    new: true,
    runValidators: true 
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

const deleteFaq = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
  }
  return result;
};

/** Terms and Condition Services */
const updateTerms = async (payload: TTermsCondition) => {
  // Finds the first document (since there's usually only one) and updates it or creates it
  const result = await TermsCondition.findOneAndUpdate({}, payload, { 
    upsert: true, 
    new: true 
  });
  return result;
};

const getTerms = async () => {
  const result = await TermsCondition.findOne();
  return result;
};

/** Privacy Policy Services */
const updatePrivacy = async (payload: TPrivacyPolicy) => {
  const result = await PrivacyPolicy.findOneAndUpdate({}, payload, { 
    upsert: true, 
    new: true 
  });
  return result;
};

const getPrivacy = async () => {
  const result = await PrivacyPolicy.findOne();
  return result;
};

export const SettingsService = {
  createFaq,
  getAllFaqs,
  updateFaq,
  deleteFaq,
  updateTerms,
  getTerms,
  updatePrivacy,
  getPrivacy,
};
import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { Faq, PrivacyPolicy, TermsCondition } from './settings.model';
//** ----------------- Faq Services --------------
const createFaqInDB = async (payload) => {
    const result = await Faq.create(payload);
    return result;
};
const getAllFaqsInDB = async () => {
    const result = await Faq.find();
    return result;
};
const getSingleFaqInDB = async (id) => {
    const result = await Faq.findById(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
const updateFaqInDB = async (id, payload) => {
    const result = await Faq.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
const deleteFaqInDB = async (id) => {
    const result = await Faq.findByIdAndDelete(id);
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
//** ----------------- Terms & Conditions Services --------------
const createTermsInDB = async (payload) => {
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
const updateTermsInDB = async (id, payload) => {
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
const createPrivacyInDB = async (payload) => {
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
const updatePrivacyInDB = async (id, payload) => {
    const result = await PrivacyPolicy.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Privacy Policy not found');
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
};
//# sourceMappingURL=settings.service.js.map
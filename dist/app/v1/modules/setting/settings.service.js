"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const settings_model_1 = require("./settings.model");
//** ----------------- Faq Services --------------
const createFaqInDB = async (payload) => {
    const result = await settings_model_1.Faq.create(payload);
    return result;
};
const getAllFaqsInDB = async () => {
    const result = await settings_model_1.Faq.find();
    return result;
};
const getSingleFaqInDB = async (id) => {
    const result = await settings_model_1.Faq.findById(id);
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
const updateFaqInDB = async (id, payload) => {
    const result = await settings_model_1.Faq.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
const deleteFaqInDB = async (id) => {
    const result = await settings_model_1.Faq.findByIdAndDelete(id);
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'FAQ not found');
    }
    return result;
};
//** ----------------- Terms & Conditions Services --------------
const createTermsInDB = async (payload) => {
    const result = await settings_model_1.TermsCondition.create(payload);
    return result;
};
const getSingleTermsInDB = async () => {
    const result = await settings_model_1.TermsCondition.findOne().sort({ created_at: -1 });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Terms and Conditions not found');
    }
    return result;
};
const updateTermsInDB = async (id, payload) => {
    const result = await settings_model_1.TermsCondition.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Terms and Conditions not found');
    }
    return result;
};
//** ----------------- Privacy Policy Services --------------
const createPrivacyInDB = async (payload) => {
    const result = await settings_model_1.PrivacyPolicy.create(payload);
    return result;
};
const getSinglePrivacyInDB = async () => {
    const result = await settings_model_1.PrivacyPolicy.findOne().sort({ created_at: -1 });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Privacy Policy not found');
    }
    return result;
};
const updatePrivacyInDB = async (id, payload) => {
    const result = await settings_model_1.PrivacyPolicy.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Privacy Policy not found');
    }
    return result;
};
//** ----------------- About Us Services --------------
const createAboutInDB = async (payload) => {
    const result = await settings_model_1.AboutUs.create(payload);
    return result;
};
const getSingleAboutInDB = async () => {
    const result = await settings_model_1.AboutUs.findOne().sort({ created_at: -1 });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'About Us not found');
    }
    return result;
};
const updateAboutInDB = async (id, payload) => {
    const result = await settings_model_1.AboutUs.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'About Us not found');
    }
    return result;
};
//** ----------------- Exporting All Services --------------
exports.SettingsService = {
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
//# sourceMappingURL=settings.service.js.map
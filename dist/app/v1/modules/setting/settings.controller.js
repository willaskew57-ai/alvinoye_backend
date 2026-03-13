"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const settings_service_1 = require("./settings.service");
const catch_async_1 = __importDefault(require("../../../../utils/catch-async"));
const send_response_1 = __importDefault(require("../../../../utils/send-response"));
// ** -------------- Faq controller --------------
const createFaq = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.createFaqInDB(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'FAQ created successfully!',
        data: result,
    });
});
const getFaqs = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.getAllFaqsInDB();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'FAQs retrieved successfully!',
        data: result,
    });
});
const getSingleFaqs = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await settings_service_1.SettingsService.getSingleFaqInDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'FAQs retrieved successfully!',
        data: result,
    });
});
const updateFaq = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await settings_service_1.SettingsService.updateFaqInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'FAQ updated successfully!',
        data: result,
    });
});
const deleteFaq = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await settings_service_1.SettingsService.deleteFaqInDB(id);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'FAQ deleted successfully!',
        data: result,
    });
});
// ** --------------- Terms route ---------------
const createTerms = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.createTermsInDB(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Terms and Conditions created successfully!',
        data: result,
    });
});
const getSingleTerms = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.getSingleTermsInDB();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Terms and Condition retrieved successfully!',
        data: result,
    });
});
const updateTerms = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const termsId = id;
    const result = await settings_service_1.SettingsService.updateTermsInDB(termsId, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Terms and Condition updated successfully!',
        data: result,
    });
});
// ** ------------ Privacy Policy Controller --------------
const createPrivacy = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.createPrivacyInDB(req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Privacy Policy created successfully!',
        data: result,
    });
});
const getSinglePrivacy = (0, catch_async_1.default)(async (req, res) => {
    const result = await settings_service_1.SettingsService.getSinglePrivacyInDB();
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Privacy Policy retrieved successfully!',
        data: result,
    });
});
const updatePrivacy = (0, catch_async_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await settings_service_1.SettingsService.updatePrivacyInDB(id, req.body);
    (0, send_response_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Privacy Policy updated successfully!',
        data: result,
    });
});
exports.SettingsController = {
    // FAQ
    createFaq,
    getFaqs,
    getSingleFaqs,
    updateFaq,
    deleteFaq,
    // Terms
    createTerms,
    getSingleTerms,
    updateTerms,
    // Privacy
    createPrivacy,
    getSinglePrivacy,
    updatePrivacy,
};
//# sourceMappingURL=settings.controller.js.map
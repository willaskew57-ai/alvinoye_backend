"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyPolicy = exports.TermsCondition = exports.Faq = void 0;
const mongoose_1 = require("mongoose");
const faqSchema = new mongoose_1.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
const termsConditionSchema = new mongoose_1.Schema({
    title: { type: String, default: 'Terms and Conditions' },
    content: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
const privacyPolicySchema = new mongoose_1.Schema({
    title: { type: String, default: 'Privacy Policy' },
    content: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
exports.Faq = (0, mongoose_1.model)('Faq', faqSchema);
exports.TermsCondition = (0, mongoose_1.model)('TermsCondition', termsConditionSchema);
exports.PrivacyPolicy = (0, mongoose_1.model)('PrivacyPolicy', privacyPolicySchema);
//# sourceMappingURL=settings.model.js.map
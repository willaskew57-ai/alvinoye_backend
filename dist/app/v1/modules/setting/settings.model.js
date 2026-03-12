import { Schema, model } from 'mongoose';
const faqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
const termsConditionSchema = new Schema({
    title: { type: String, default: 'Terms and Conditions' },
    content: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
const privacyPolicySchema = new Schema({
    title: { type: String, default: 'Privacy Policy' },
    content: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
});
export const Faq = model('Faq', faqSchema);
export const TermsCondition = model('TermsCondition', termsConditionSchema);
export const PrivacyPolicy = model('PrivacyPolicy', privacyPolicySchema);
//# sourceMappingURL=settings.model.js.map
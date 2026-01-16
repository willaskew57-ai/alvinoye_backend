import { Schema, model } from 'mongoose';
import type { TFaq, TTermsCondition, TPrivacyPolicy } from './settings.interface';

const faqSchema = new Schema<TFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const termsConditionSchema = new Schema<TTermsCondition>(
  {
    title: { type: String, default: 'Terms and Conditions' },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const privacyPolicySchema = new Schema<TPrivacyPolicy>(
  {
    title: { type: String, default: 'Privacy Policy' },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Faq = model<TFaq>('Faq', faqSchema);
export const TermsCondition = model<TTermsCondition>('TermsCondition', termsConditionSchema);
export const PrivacyPolicy = model<TPrivacyPolicy>('PrivacyPolicy', privacyPolicySchema);
import type { TFaq, TTermsCondition, TPrivacyPolicy } from './settings.interface';
export declare const Faq: import("mongoose").Model<TFaq, {}, {}, {}, import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TFaq>;
export declare const TermsCondition: import("mongoose").Model<TTermsCondition, {}, {}, {}, import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TTermsCondition>;
export declare const PrivacyPolicy: import("mongoose").Model<TPrivacyPolicy, {}, {}, {}, import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TPrivacyPolicy>;
//# sourceMappingURL=settings.model.d.ts.map
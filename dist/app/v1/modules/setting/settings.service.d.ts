import type { TFaq, TPrivacyPolicy, TTermsCondition } from './settings.interface';
export declare const SettingsService: {
    createFaq: (payload: TFaq) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllFaqs: () => Promise<(import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateFaq: (id: string, payload: Partial<TFaq>) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteFaq: (id: string) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTerms: (payload: TTermsCondition) => Promise<import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getTerms: () => Promise<(import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updatePrivacy: (payload: TPrivacyPolicy) => Promise<import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getPrivacy: () => Promise<(import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=settings.service.d.ts.map
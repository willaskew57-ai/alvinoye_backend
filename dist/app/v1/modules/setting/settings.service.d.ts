import type { TFaq, TPrivacyPolicy, TTermsCondition, TAboutUs } from './settings.interface';
export declare const SettingsService: {
    createFaqInDB: (payload: TFaq) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getAllFaqsInDB: () => Promise<(import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getSingleFaqInDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateFaqInDB: (id: string, payload: Partial<TFaq>) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteFaqInDB: (id: string) => Promise<import("mongoose").Document<unknown, {}, TFaq, {}, import("mongoose").DefaultSchemaOptions> & TFaq & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    createTermsInDB: (payload: TTermsCondition) => Promise<import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getSingleTermsInDB: () => Promise<import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateTermsInDB: (id: string, payload: Partial<TTermsCondition>) => Promise<import("mongoose").Document<unknown, {}, TTermsCondition, {}, import("mongoose").DefaultSchemaOptions> & TTermsCondition & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    createPrivacyInDB: (payload: TPrivacyPolicy) => Promise<import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getSinglePrivacyInDB: () => Promise<import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePrivacyInDB: (id: string, payload: Partial<TPrivacyPolicy>) => Promise<import("mongoose").Document<unknown, {}, TPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & TPrivacyPolicy & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    createAboutInDB: (payload: TAboutUs) => Promise<import("mongoose").Document<unknown, {}, TAboutUs, {}, import("mongoose").DefaultSchemaOptions> & TAboutUs & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    getSingleAboutInDB: () => Promise<import("mongoose").Document<unknown, {}, TAboutUs, {}, import("mongoose").DefaultSchemaOptions> & TAboutUs & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    updateAboutInDB: (id: string, payload: Partial<TAboutUs>) => Promise<import("mongoose").Document<unknown, {}, TAboutUs, {}, import("mongoose").DefaultSchemaOptions> & TAboutUs & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
};
//# sourceMappingURL=settings.service.d.ts.map
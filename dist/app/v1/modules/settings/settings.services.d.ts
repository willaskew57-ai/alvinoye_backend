import type { IPrivacyPolicy } from './settings.interface';
export declare const SettingsServices: {
    createPrivacyPolicyIntoDB: (payload: IPrivacyPolicy) => Promise<import("mongoose").Document<unknown, {}, import("./settings.model").IPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./settings.model").IPrivacyPolicy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getPrivacyPolicyFromDB: () => Promise<import("mongoose").Document<unknown, {}, import("./settings.model").IPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./settings.model").IPrivacyPolicy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updatePrivacyPolicyIntoDB: (id: string, payload: Partial<IPrivacyPolicy>) => Promise<(import("mongoose").Document<unknown, {}, import("./settings.model").IPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./settings.model").IPrivacyPolicy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deletePrivacyPolicyFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, import("./settings.model").IPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & import("./settings.model").IPrivacyPolicy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
};
//# sourceMappingURL=settings.services.d.ts.map
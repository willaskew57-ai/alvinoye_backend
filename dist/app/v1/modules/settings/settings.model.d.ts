import { Types, Document } from 'mongoose';
export interface IPrivacyPolicy extends Document {
    title?: string;
    content: string;
    created_by?: Types.ObjectId | null;
    updated_by?: Types.ObjectId | null;
    created_at: Date;
    updated_at: Date;
}
declare const PrivacyPolicy: import("mongoose").Model<IPrivacyPolicy, {}, {}, {}, Document<unknown, {}, IPrivacyPolicy, {}, import("mongoose").DefaultSchemaOptions> & IPrivacyPolicy & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPrivacyPolicy>;
export default PrivacyPolicy;
//# sourceMappingURL=settings.model.d.ts.map
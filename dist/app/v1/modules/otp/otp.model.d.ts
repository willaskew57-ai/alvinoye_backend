import { Types } from 'mongoose';
import type { TOtp } from './otp.interface';
export declare const Otp: import("mongoose").Model<TOtp, {}, {}, {}, import("mongoose").Document<unknown, {}, TOtp, {}, import("mongoose").DefaultSchemaOptions> & TOtp & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, TOtp>;
export default Otp;
//# sourceMappingURL=otp.model.d.ts.map
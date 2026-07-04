import { type TWallet, type TWalletTransaction, type TWithdrawal, type TCommissionSetting } from './wallet.interface';
export declare const Wallet: import("mongoose").Model<TWallet, {}, {}, {}, import("mongoose").Document<unknown, {}, TWallet, {}, import("mongoose").DefaultSchemaOptions> & TWallet & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, TWallet>;
export declare const WalletTransaction: import("mongoose").Model<TWalletTransaction, {}, {}, {}, import("mongoose").Document<unknown, {}, TWalletTransaction, {}, import("mongoose").DefaultSchemaOptions> & TWalletTransaction & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, TWalletTransaction>;
export declare const Withdrawal: import("mongoose").Model<TWithdrawal, {}, {}, {}, import("mongoose").Document<unknown, {}, TWithdrawal, {}, import("mongoose").DefaultSchemaOptions> & TWithdrawal & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, TWithdrawal>;
export declare const CommissionSetting: import("mongoose").Model<TCommissionSetting, {}, {}, {}, import("mongoose").Document<unknown, {}, TCommissionSetting, {}, import("mongoose").DefaultSchemaOptions> & TCommissionSetting & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, TCommissionSetting>;
//# sourceMappingURL=wallet.model.d.ts.map
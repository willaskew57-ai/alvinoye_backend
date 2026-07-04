import type { Document, Types } from 'mongoose';
export declare const WALLET_TX_TYPE: {
    readonly EARNING: "EARNING";
    readonly DISTRIBUTION: "DISTRIBUTION";
    readonly WITHDRAWAL: "WITHDRAWAL";
    readonly WITHDRAWAL_REVERSAL: "WITHDRAWAL_REVERSAL";
};
export declare const WITHDRAWAL_STATUS: {
    readonly PROCESSING: "PROCESSING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
};
export type TWalletTxType = (typeof WALLET_TX_TYPE)[keyof typeof WALLET_TX_TYPE];
export type TWithdrawalStatus = (typeof WITHDRAWAL_STATUS)[keyof typeof WITHDRAWAL_STATUS];
export interface TWallet extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    pending_balance: number;
    available_balance: number;
    total_earned: number;
    total_withdrawn: number;
    currency: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface TWalletTransaction extends Document {
    wallet_id: Types.ObjectId;
    user_id: Types.ObjectId;
    type: TWalletTxType;
    amount: number;
    balance_after: number;
    parcel_id?: Types.ObjectId | null;
    withdrawal_id?: Types.ObjectId | null;
    gross_amount?: number | null;
    commission_amount?: number | null;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface TWithdrawal extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    wallet_id: Types.ObjectId;
    amount: number;
    currency: string;
    status: TWithdrawalStatus;
    bank_snapshot: {
        bank_name: string;
        account_number: string;
        account_holder_name: string;
    };
    dpo_payout_ref?: string | null;
    failure_reason?: string | null;
    created_at?: Date;
    updated_at?: Date;
}
export interface TCommissionSetting extends Document {
    percentage: number;
    created_at?: Date;
    updated_at?: Date;
}
//# sourceMappingURL=wallet.interface.d.ts.map
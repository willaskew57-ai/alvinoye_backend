import mongoose, { Types, type ClientSession } from 'mongoose';
import { type TWallet } from './wallet.interface';
export declare const WalletServices: {
    getOrCreateWallet: (userId: string | Types.ObjectId, session?: ClientSession) => Promise<TWallet>;
    getMyWallet: (userId: string) => Promise<{
        wallet_id: Types.ObjectId;
        pending_balance: number;
        available_balance: number;
        total_earned: number;
        total_withdrawn: number;
        currency: string;
        commission_percentage: number;
    }>;
    getMyTransactions: (userId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("./wallet.interface").TWalletTransaction, {}, mongoose.DefaultSchemaOptions> & import("./wallet.interface").TWalletTransaction & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    creditEarning: (params: {
        driverUserId: string | Types.ObjectId;
        parcelId: string | Types.ObjectId;
        grossAmount: number;
    }, session: ClientSession) => Promise<{
        net: number;
        commissionAmount: number;
    } | null>;
    distributeWeekly: () => Promise<{
        total: number;
        distributed: number;
    }>;
    requestWithdrawal: (userId: string, amount: number) => Promise<{
        withdrawal: (mongoose.Document<unknown, {}, import("./wallet.interface").TWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./wallet.interface").TWithdrawal & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
        available_balance: number;
    }>;
    getMyWithdrawals: (userId: string, query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("./wallet.interface").TWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./wallet.interface").TWithdrawal & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getAllWithdrawals: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (mongoose.Document<unknown, {}, import("./wallet.interface").TWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./wallet.interface").TWithdrawal & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    retryPayout: (withdrawalId: string) => Promise<(mongoose.Document<unknown, {}, import("./wallet.interface").TWithdrawal, {}, mongoose.DefaultSchemaOptions> & import("./wallet.interface").TWithdrawal & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    getCommission: () => Promise<{
        percentage: number;
    }>;
    updateCommission: (percentage: number) => Promise<{
        percentage: number;
    }>;
};
//# sourceMappingURL=wallet.service.d.ts.map
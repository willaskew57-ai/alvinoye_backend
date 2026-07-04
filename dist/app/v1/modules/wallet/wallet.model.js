"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionSetting = exports.Withdrawal = exports.WalletTransaction = exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const timestamps = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};
// --- Wallet ---
const walletSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    pending_balance: { type: Number, default: 0 },
    available_balance: { type: Number, default: 0 },
    total_earned: { type: Number, default: 0 },
    total_withdrawn: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
}, timestamps);
exports.Wallet = (0, mongoose_1.model)('Wallet', walletSchema);
// --- Wallet Transaction (ledger) ---
const walletTransactionSchema = new mongoose_1.Schema({
    wallet_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: Object.values(wallet_interface_1.WALLET_TX_TYPE),
        required: true,
    },
    amount: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    parcel_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Parcel', default: null },
    withdrawal_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Withdrawal',
        default: null,
    },
    gross_amount: { type: Number, default: null },
    commission_amount: { type: Number, default: null },
    description: { type: String, default: '' },
}, timestamps);
exports.WalletTransaction = (0, mongoose_1.model)('WalletTransaction', walletTransactionSchema);
// --- Withdrawal ---
const withdrawalSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    wallet_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.WITHDRAWAL_STATUS),
        default: wallet_interface_1.WITHDRAWAL_STATUS.PROCESSING,
    },
    bank_snapshot: {
        bank_name: { type: String, required: true },
        account_number: { type: String, required: true },
        account_holder_name: { type: String, required: true },
    },
    dpo_payout_ref: { type: String, default: null },
    failure_reason: { type: String, default: null },
}, timestamps);
exports.Withdrawal = (0, mongoose_1.model)('Withdrawal', withdrawalSchema);
// --- Commission Setting (singleton, latest doc wins) ---
const commissionSettingSchema = new mongoose_1.Schema({
    percentage: { type: Number, required: true, min: 0, max: 100 },
}, timestamps);
exports.CommissionSetting = (0, mongoose_1.model)('CommissionSetting', commissionSettingSchema);
//# sourceMappingURL=wallet.model.js.map
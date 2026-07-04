import { Schema, model } from 'mongoose';
import {
  WALLET_TX_TYPE,
  WITHDRAWAL_STATUS,
  type TWallet,
  type TWalletTransaction,
  type TWithdrawal,
  type TCommissionSetting,
} from './wallet.interface';

const timestamps = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
} as const;

// --- Wallet ---
const walletSchema = new Schema<TWallet>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    pending_balance: { type: Number, default: 0 },
    available_balance: { type: Number, default: 0 },
    total_earned: { type: Number, default: 0 },
    total_withdrawn: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
  },
  timestamps
);

export const Wallet = model<TWallet>('Wallet', walletSchema);

// --- Wallet Transaction (ledger) ---
const walletTransactionSchema = new Schema<TWalletTransaction>(
  {
    wallet_id: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: Object.values(WALLET_TX_TYPE),
      required: true,
    },
    amount: { type: Number, required: true },
    balance_after: { type: Number, required: true },
    parcel_id: { type: Schema.Types.ObjectId, ref: 'Parcel', default: null },
    withdrawal_id: {
      type: Schema.Types.ObjectId,
      ref: 'Withdrawal',
      default: null,
    },
    gross_amount: { type: Number, default: null },
    commission_amount: { type: Number, default: null },
    description: { type: String, default: '' },
  },
  timestamps
);

export const WalletTransaction = model<TWalletTransaction>(
  'WalletTransaction',
  walletTransactionSchema
);

// --- Withdrawal ---
const withdrawalSchema = new Schema<TWithdrawal>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    wallet_id: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: Object.values(WITHDRAWAL_STATUS),
      default: WITHDRAWAL_STATUS.PROCESSING,
    },
    bank_snapshot: {
      bank_name: { type: String, required: true },
      account_number: { type: String, required: true },
      account_holder_name: { type: String, required: true },
    },
    dpo_payout_ref: { type: String, default: null },
    failure_reason: { type: String, default: null },
  },
  timestamps
);

export const Withdrawal = model<TWithdrawal>('Withdrawal', withdrawalSchema);

// --- Commission Setting (singleton, latest doc wins) ---
const commissionSettingSchema = new Schema<TCommissionSetting>(
  {
    percentage: { type: Number, required: true, min: 0, max: 100 },
  },
  timestamps
);

export const CommissionSetting = model<TCommissionSetting>(
  'CommissionSetting',
  commissionSettingSchema
);

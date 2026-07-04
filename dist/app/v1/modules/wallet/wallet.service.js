"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_error_1 = __importDefault(require("../../../../errors/app-error"));
const env_config_1 = __importDefault(require("../../../../config/env.config"));
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const dpo_1 = require("../../../../config/dpo");
const notification_service_1 = require("../notification/notification.service");
const notification_constant_1 = require("../notification/notification.constant");
const driver_model_1 = require("../driver/driver.model");
const wallet_model_1 = require("./wallet.model");
const wallet_interface_1 = require("./wallet.interface");
const round2 = (n) => Math.round(n * 100) / 100;
/** Get the active commission percentage (latest admin setting, else env default). */
const getCommissionPercentage = async () => {
    const setting = await wallet_model_1.CommissionSetting.findOne().sort({ created_at: -1 });
    return setting ? setting.percentage : env_config_1.default.wallet_default_commission_percent;
};
/** Fetch (or lazily create) a user's wallet. Safe to call inside a session. */
const getOrCreateWallet = async (userId, session) => {
    const wallet = await wallet_model_1.Wallet.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId, currency: env_config_1.default.dpo_currency } }, { new: true, upsert: true, ...(session ? { session } : {}) });
    return wallet;
};
// ** ---------- Driver-facing ----------
const getMyWallet = async (userId) => {
    const wallet = await getOrCreateWallet(userId);
    const commission = await getCommissionPercentage();
    return {
        wallet_id: wallet._id,
        pending_balance: round2(wallet.pending_balance),
        available_balance: round2(wallet.available_balance),
        total_earned: round2(wallet.total_earned),
        total_withdrawn: round2(wallet.total_withdrawn),
        currency: wallet.currency,
        commission_percentage: commission,
    };
};
const getMyTransactions = async (userId, query) => {
    const txQuery = new query_builder_1.default(wallet_model_1.WalletTransaction.find({ user_id: userId }).populate('parcel_id', 'parcel_id parcel_name'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await txQuery.modelQuery;
    const meta = await txQuery.countTotal();
    return { meta, data };
};
/**
 * Credit a driver's earning for a completed parcel into their PENDING balance,
 * keeping the company commission. Must run inside the parcel-completion
 * transaction so the credit is atomic with the parcel status change.
 */
const creditEarning = async (params, session) => {
    const { driverUserId, parcelId, grossAmount } = params;
    if (!driverUserId || !grossAmount || grossAmount <= 0)
        return null;
    const percentage = await getCommissionPercentage();
    const commissionAmount = round2((grossAmount * percentage) / 100);
    const net = round2(grossAmount - commissionAmount);
    const wallet = await wallet_model_1.Wallet.findOneAndUpdate({ user_id: driverUserId }, {
        $inc: { pending_balance: net, total_earned: net },
        $setOnInsert: { user_id: driverUserId, currency: env_config_1.default.dpo_currency },
    }, { new: true, upsert: true, session });
    await wallet_model_1.WalletTransaction.create([
        {
            wallet_id: wallet._id,
            user_id: driverUserId,
            type: wallet_interface_1.WALLET_TX_TYPE.EARNING,
            amount: net,
            balance_after: round2(wallet.available_balance),
            parcel_id: parcelId,
            gross_amount: round2(grossAmount),
            commission_amount: commissionAmount,
            description: `Earning for completed delivery (commission ${percentage}%)`,
        },
    ], { session });
    return { net, commissionAmount };
};
/**
 * Weekly job: move every driver's PENDING balance into AVAILABLE so it becomes
 * withdrawable. Uses $inc from a read snapshot so concurrent earnings that land
 * mid-run are not lost.
 */
const distributeWeekly = async () => {
    const wallets = await wallet_model_1.Wallet.find({ pending_balance: { $gt: 0 } });
    let distributedCount = 0;
    for (const wallet of wallets) {
        const amount = round2(wallet.pending_balance);
        if (amount <= 0)
            continue;
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            await wallet_model_1.Wallet.updateOne({ _id: wallet._id }, {
                $inc: { pending_balance: -amount, available_balance: amount },
            }, { session });
            await wallet_model_1.WalletTransaction.create([
                {
                    wallet_id: wallet._id,
                    user_id: wallet.user_id,
                    type: wallet_interface_1.WALLET_TX_TYPE.DISTRIBUTION,
                    amount,
                    balance_after: round2(wallet.available_balance + amount),
                    description: 'Weekly earnings distribution',
                },
            ], { session });
            await session.commitTransaction();
            distributedCount++;
            try {
                await notification_service_1.NotificationServices.createNotificationIntoDB({
                    user_id: wallet.user_id,
                    type: notification_constant_1.NOTIFICATION_TYPE.WALLET_DISTRIBUTED,
                    title: 'Earnings Available',
                    message: `${amount} ${wallet.currency} is now available in your wallet for withdrawal.`,
                    data: { amount, currency: wallet.currency },
                });
            }
            catch (err) {
                console.error('[wallet] distribution notification failed:', err);
            }
        }
        catch (error) {
            await session.abortTransaction();
            console.error(`[wallet] distribution failed for wallet ${wallet._id}:`, error);
        }
        finally {
            await session.endSession();
        }
    }
    console.log(`[wallet] Weekly distribution complete: ${distributedCount}/${wallets.length} wallets`);
    return { total: wallets.length, distributed: distributedCount };
};
// ** ---------- Withdrawal ----------
const requestWithdrawal = async (userId, amount) => {
    const withdrawAmount = round2(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Invalid withdrawal amount');
    }
    // Driver must have complete bank details saved during onboarding.
    const driver = await driver_model_1.Driver.findOne({ user_id: userId });
    const bank = driver?.bank_details;
    if (!bank ||
        !bank.bank_name ||
        !bank.account_number ||
        !bank.account_holder_name) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Please add your bank account details before withdrawing');
    }
    const wallet = await getOrCreateWallet(userId);
    if (wallet.available_balance < withdrawAmount) {
        // Give a clearer hint when money exists but is not yet distributed.
        if (wallet.pending_balance > 0) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'This amount is not available yet. Pending earnings become withdrawable after the weekly distribution (every Sunday).');
        }
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient available balance');
    }
    const session = await mongoose_1.default.startSession();
    let withdrawalId;
    let newAvailable = 0;
    try {
        session.startTransaction();
        // Atomic guarded debit prevents concurrent double-withdrawal.
        const debited = await wallet_model_1.Wallet.findOneAndUpdate({ user_id: userId, available_balance: { $gte: withdrawAmount } }, {
            $inc: {
                available_balance: -withdrawAmount,
                total_withdrawn: withdrawAmount,
            },
        }, { new: true, session });
        if (!debited) {
            throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient available balance');
        }
        newAvailable = round2(debited.available_balance);
        const [withdrawal] = await wallet_model_1.Withdrawal.create([
            {
                user_id: userId,
                wallet_id: debited._id,
                amount: withdrawAmount,
                currency: debited.currency,
                status: wallet_interface_1.WITHDRAWAL_STATUS.PROCESSING,
                bank_snapshot: {
                    bank_name: bank.bank_name,
                    account_number: bank.account_number,
                    account_holder_name: bank.account_holder_name,
                },
            },
        ], { session });
        withdrawalId = withdrawal._id;
        await wallet_model_1.WalletTransaction.create([
            {
                wallet_id: debited._id,
                user_id: userId,
                type: wallet_interface_1.WALLET_TX_TYPE.WITHDRAWAL,
                amount: withdrawAmount,
                balance_after: newAvailable,
                withdrawal_id: withdrawalId,
                description: 'Withdrawal request',
            },
        ], { session });
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
    // Attempt the actual DPO payout AFTER the debit is committed.
    await attemptPayout(withdrawalId, userId);
    const withdrawal = await wallet_model_1.Withdrawal.findById(withdrawalId);
    return {
        withdrawal,
        available_balance: newAvailable,
    };
};
/**
 * Try to disburse a withdrawal via DPO. On success -> PAID. On a "not
 * configured" error -> stays PROCESSING for admin/manual payout. On any other
 * failure -> FAILED and the balance is reversed back to the driver.
 */
const attemptPayout = async (withdrawalId, userId) => {
    const withdrawal = await wallet_model_1.Withdrawal.findById(withdrawalId);
    if (!withdrawal || withdrawal.status !== wallet_interface_1.WITHDRAWAL_STATUS.PROCESSING)
        return;
    try {
        const result = await (0, dpo_1.createDpoPayout)({
            amount: withdrawal.amount,
            currency: withdrawal.currency,
            bank_name: withdrawal.bank_snapshot.bank_name,
            account_number: withdrawal.bank_snapshot.account_number,
            account_holder_name: withdrawal.bank_snapshot.account_holder_name,
            reference: withdrawal._id.toString(),
        });
        if (result.success) {
            withdrawal.status = wallet_interface_1.WITHDRAWAL_STATUS.PAID;
            withdrawal.dpo_payout_ref = result.payoutRef ?? null;
            await withdrawal.save();
            try {
                await notification_service_1.NotificationServices.createNotificationIntoDB({
                    user_id: userId,
                    type: notification_constant_1.NOTIFICATION_TYPE.WITHDRAWAL_PAID,
                    title: 'Withdrawal Paid',
                    message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} has been sent to your bank account.`,
                    data: { amount: withdrawal.amount, currency: withdrawal.currency },
                });
            }
            catch (err) {
                console.error('[wallet] payout-paid notification failed:', err);
            }
            return;
        }
        // Gateway reachable but declined -> fail + reverse.
        await failAndReverse(withdrawal._id, userId, result.resultExplanation || 'Payout declined by gateway');
    }
    catch (error) {
        // Payout not configured -> leave PROCESSING for manual admin handling.
        if (error instanceof app_error_1.default && error.statusCode === http_status_1.default.NOT_IMPLEMENTED) {
            console.warn('[wallet] DPO payout not configured; withdrawal left PROCESSING for admin');
            return;
        }
        // Transport/other error -> fail + reverse so the driver is not out of pocket.
        await failAndReverse(withdrawal._id, userId, error?.message || 'Payout failed');
    }
};
const failAndReverse = async (withdrawalId, userId, reason) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const withdrawal = await wallet_model_1.Withdrawal.findById(withdrawalId).session(session);
        if (!withdrawal || withdrawal.status !== wallet_interface_1.WITHDRAWAL_STATUS.PROCESSING) {
            await session.abortTransaction();
            return;
        }
        withdrawal.status = wallet_interface_1.WITHDRAWAL_STATUS.FAILED;
        withdrawal.failure_reason = reason;
        await withdrawal.save({ session });
        const reverted = await wallet_model_1.Wallet.findOneAndUpdate({ user_id: userId }, {
            $inc: {
                available_balance: withdrawal.amount,
                total_withdrawn: -withdrawal.amount,
            },
        }, { new: true, session });
        await wallet_model_1.WalletTransaction.create([
            {
                wallet_id: withdrawal.wallet_id,
                user_id: userId,
                type: wallet_interface_1.WALLET_TX_TYPE.WITHDRAWAL_REVERSAL,
                amount: withdrawal.amount,
                balance_after: round2(reverted?.available_balance ?? 0),
                withdrawal_id: withdrawal._id,
                description: `Withdrawal reversed: ${reason}`,
            },
        ], { session });
        await session.commitTransaction();
        try {
            await notification_service_1.NotificationServices.createNotificationIntoDB({
                user_id: userId,
                type: notification_constant_1.NOTIFICATION_TYPE.WITHDRAWAL_FAILED,
                title: 'Withdrawal Failed',
                message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} could not be processed and was refunded to your wallet.`,
                data: { amount: withdrawal.amount, reason },
            });
        }
        catch (err) {
            console.error('[wallet] payout-failed notification failed:', err);
        }
    }
    catch (error) {
        await session.abortTransaction();
        console.error('[wallet] failAndReverse error:', error);
    }
    finally {
        await session.endSession();
    }
};
const getMyWithdrawals = async (userId, query) => {
    const wQuery = new query_builder_1.default(wallet_model_1.Withdrawal.find({ user_id: userId }), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await wQuery.modelQuery;
    const meta = await wQuery.countTotal();
    return { meta, data };
};
// ** ---------- Admin ----------
const getAllWithdrawals = async (query) => {
    const wQuery = new query_builder_1.default(wallet_model_1.Withdrawal.find().populate('user_id', 'full_name email phone_number'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await wQuery.modelQuery;
    const meta = await wQuery.countTotal();
    return { meta, data };
};
/** Admin: retry a PROCESSING/FAILED payout (e.g. after enabling DPO payout). */
const retryPayout = async (withdrawalId) => {
    const withdrawal = await wallet_model_1.Withdrawal.findById(withdrawalId);
    if (!withdrawal) {
        throw new app_error_1.default(http_status_1.default.NOT_FOUND, 'Withdrawal not found');
    }
    if (withdrawal.status === wallet_interface_1.WITHDRAWAL_STATUS.PAID) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Withdrawal already paid');
    }
    // If it previously FAILED, the balance was already reversed; re-run the debit
    // is out of scope — only PROCESSING items are safe to retry as-is.
    if (withdrawal.status !== wallet_interface_1.WITHDRAWAL_STATUS.PROCESSING) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Only PROCESSING withdrawals can be retried');
    }
    await attemptPayout(withdrawal._id, withdrawal.user_id);
    return wallet_model_1.Withdrawal.findById(withdrawalId);
};
const getCommission = async () => {
    const percentage = await getCommissionPercentage();
    return { percentage };
};
const updateCommission = async (percentage) => {
    if (percentage < 0 || percentage > 100) {
        throw new app_error_1.default(http_status_1.default.BAD_REQUEST, 'Commission percentage must be between 0 and 100');
    }
    const setting = await wallet_model_1.CommissionSetting.create({ percentage });
    return { percentage: setting.percentage };
};
exports.WalletServices = {
    getOrCreateWallet,
    getMyWallet,
    getMyTransactions,
    creditEarning,
    distributeWeekly,
    requestWithdrawal,
    getMyWithdrawals,
    getAllWithdrawals,
    retryPayout,
    getCommission,
    updateCommission,
};
//# sourceMappingURL=wallet.service.js.map
import httpStatus from 'http-status';
import mongoose, { Types, type ClientSession } from 'mongoose';

import AppError from '../../../../errors/app-error';
import config from '../../../../config/env.config';
import QueryBuilder from '../../../../builders/query-builder';
import { createDpoPayout } from '../../../../config/dpo';
import { NotificationServices } from '../notification/notification.service';
import { NOTIFICATION_TYPE } from '../notification/notification.constant';
import { Driver } from '../driver/driver.model';
import {
  Wallet,
  WalletTransaction,
  Withdrawal,
  CommissionSetting,
} from './wallet.model';
import {
  WALLET_TX_TYPE,
  WITHDRAWAL_STATUS,
  type TWallet,
} from './wallet.interface';

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** Get the active commission percentage (latest admin setting, else env default). */
const getCommissionPercentage = async (): Promise<number> => {
  const setting = await CommissionSetting.findOne().sort({ created_at: -1 });
  return setting ? setting.percentage : config.wallet_default_commission_percent;
};

/** Fetch (or lazily create) a user's wallet. Safe to call inside a session. */
const getOrCreateWallet = async (
  userId: string | Types.ObjectId,
  session?: ClientSession
): Promise<TWallet> => {
  const wallet = await Wallet.findOneAndUpdate(
    { user_id: userId },
    { $setOnInsert: { user_id: userId, currency: config.dpo_currency } },
    { new: true, upsert: true, ...(session ? { session } : {}) }
  );
  return wallet as TWallet;
};

// ** ---------- Driver-facing ----------

const getMyWallet = async (userId: string) => {
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

const getMyTransactions = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const txQuery = new QueryBuilder(
    WalletTransaction.find({ user_id: userId }).populate(
      'parcel_id',
      'parcel_id parcel_name'
    ),
    query
  )
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
const creditEarning = async (
  params: {
    driverUserId: string | Types.ObjectId;
    parcelId: string | Types.ObjectId;
    grossAmount: number;
  },
  session: ClientSession
) => {
  const { driverUserId, parcelId, grossAmount } = params;
  if (!driverUserId || !grossAmount || grossAmount <= 0) return null;

  const percentage = await getCommissionPercentage();
  const commissionAmount = round2((grossAmount * percentage) / 100);
  const net = round2(grossAmount - commissionAmount);

  const wallet = await Wallet.findOneAndUpdate(
    { user_id: driverUserId },
    {
      $inc: { pending_balance: net, total_earned: net },
      $setOnInsert: { user_id: driverUserId, currency: config.dpo_currency },
    },
    { new: true, upsert: true, session }
  );

  await WalletTransaction.create(
    [
      {
        wallet_id: wallet!._id,
        user_id: driverUserId,
        type: WALLET_TX_TYPE.EARNING,
        amount: net,
        balance_after: round2(wallet!.available_balance),
        parcel_id: parcelId,
        gross_amount: round2(grossAmount),
        commission_amount: commissionAmount,
        description: `Earning for completed delivery (commission ${percentage}%)`,
      },
    ],
    { session }
  );

  return { net, commissionAmount };
};

/**
 * Weekly job: move every driver's PENDING balance into AVAILABLE so it becomes
 * withdrawable. Uses $inc from a read snapshot so concurrent earnings that land
 * mid-run are not lost.
 */
const distributeWeekly = async () => {
  const wallets = await Wallet.find({ pending_balance: { $gt: 0 } });
  let distributedCount = 0;

  for (const wallet of wallets) {
    const amount = round2(wallet.pending_balance);
    if (amount <= 0) continue;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await Wallet.updateOne(
        { _id: wallet._id },
        {
          $inc: { pending_balance: -amount, available_balance: amount },
        },
        { session }
      );

      await WalletTransaction.create(
        [
          {
            wallet_id: wallet._id,
            user_id: wallet.user_id,
            type: WALLET_TX_TYPE.DISTRIBUTION,
            amount,
            balance_after: round2(wallet.available_balance + amount),
            description: 'Weekly earnings distribution',
          },
        ],
        { session }
      );

      await session.commitTransaction();
      distributedCount++;

      try {
        await NotificationServices.createNotificationIntoDB({
          user_id: wallet.user_id,
          type: NOTIFICATION_TYPE.WALLET_DISTRIBUTED,
          title: 'Earnings Available',
          message: `${amount} ${wallet.currency} is now available in your wallet for withdrawal.`,
          data: { amount, currency: wallet.currency },
        });
      } catch (err) {
        console.error('[wallet] distribution notification failed:', err);
      }
    } catch (error) {
      await session.abortTransaction();
      console.error(
        `[wallet] distribution failed for wallet ${wallet._id}:`,
        error
      );
    } finally {
      await session.endSession();
    }
  }

  console.log(
    `[wallet] Weekly distribution complete: ${distributedCount}/${wallets.length} wallets`
  );
  return { total: wallets.length, distributed: distributedCount };
};

// ** ---------- Withdrawal ----------

const requestWithdrawal = async (userId: string, amount: number) => {
  const withdrawAmount = round2(amount);
  if (!withdrawAmount || withdrawAmount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid withdrawal amount');
  }

  // Driver must have complete bank details saved during onboarding.
  const driver = await Driver.findOne({ user_id: userId });
  const bank = driver?.bank_details;
  if (
    !bank ||
    !bank.bank_name ||
    !bank.account_number ||
    !bank.account_holder_name
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please add your bank account details before withdrawing'
    );
  }

  const wallet = await getOrCreateWallet(userId);

  if (wallet.available_balance < withdrawAmount) {
    // Give a clearer hint when money exists but is not yet distributed.
    if (wallet.pending_balance > 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'This amount is not available yet. Pending earnings become withdrawable after the weekly distribution (every Sunday).'
      );
    }
    throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient available balance');
  }

  const session = await mongoose.startSession();
  let withdrawalId: Types.ObjectId;
  let newAvailable = 0;

  try {
    session.startTransaction();

    // Atomic guarded debit prevents concurrent double-withdrawal.
    const debited = await Wallet.findOneAndUpdate(
      { user_id: userId, available_balance: { $gte: withdrawAmount } },
      {
        $inc: {
          available_balance: -withdrawAmount,
          total_withdrawn: withdrawAmount,
        },
      },
      { new: true, session }
    );

    if (!debited) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Insufficient available balance'
      );
    }
    newAvailable = round2(debited.available_balance);

    const [withdrawal] = await Withdrawal.create(
      [
        {
          user_id: userId,
          wallet_id: debited._id,
          amount: withdrawAmount,
          currency: debited.currency,
          status: WITHDRAWAL_STATUS.PROCESSING,
          bank_snapshot: {
            bank_name: bank.bank_name,
            account_number: bank.account_number,
            account_holder_name: bank.account_holder_name,
          },
        },
      ],
      { session }
    );
    withdrawalId = withdrawal!._id;

    await WalletTransaction.create(
      [
        {
          wallet_id: debited._id,
          user_id: userId,
          type: WALLET_TX_TYPE.WITHDRAWAL,
          amount: withdrawAmount,
          balance_after: newAvailable,
          withdrawal_id: withdrawalId,
          description: 'Withdrawal request',
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }

  // Attempt the actual DPO payout AFTER the debit is committed.
  await attemptPayout(withdrawalId, userId);

  const withdrawal = await Withdrawal.findById(withdrawalId);
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
const attemptPayout = async (
  withdrawalId: Types.ObjectId,
  userId: string | Types.ObjectId
) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal || withdrawal.status !== WITHDRAWAL_STATUS.PROCESSING) return;

  try {
    const result = await createDpoPayout({
      amount: withdrawal.amount,
      currency: withdrawal.currency,
      bank_name: withdrawal.bank_snapshot.bank_name,
      account_number: withdrawal.bank_snapshot.account_number,
      account_holder_name: withdrawal.bank_snapshot.account_holder_name,
      reference: withdrawal._id.toString(),
    });

    if (result.success) {
      withdrawal.status = WITHDRAWAL_STATUS.PAID;
      withdrawal.dpo_payout_ref = result.payoutRef ?? null;
      await withdrawal.save();

      try {
        await NotificationServices.createNotificationIntoDB({
          user_id: userId,
          type: NOTIFICATION_TYPE.WITHDRAWAL_PAID,
          title: 'Withdrawal Paid',
          message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} has been sent to your bank account.`,
          data: { amount: withdrawal.amount, currency: withdrawal.currency },
        });
      } catch (err) {
        console.error('[wallet] payout-paid notification failed:', err);
      }
      return;
    }

    // Gateway reachable but declined -> fail + reverse.
    await failAndReverse(
      withdrawal._id,
      userId,
      result.resultExplanation || 'Payout declined by gateway'
    );
  } catch (error: any) {
    // Payout not configured -> leave PROCESSING for manual admin handling.
    if (error instanceof AppError && error.statusCode === httpStatus.NOT_IMPLEMENTED) {
      console.warn(
        '[wallet] DPO payout not configured; withdrawal left PROCESSING for admin'
      );
      return;
    }
    // Transport/other error -> fail + reverse so the driver is not out of pocket.
    await failAndReverse(
      withdrawal._id,
      userId,
      error?.message || 'Payout failed'
    );
  }
};

const failAndReverse = async (
  withdrawalId: Types.ObjectId,
  userId: string | Types.ObjectId,
  reason: string
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const withdrawal = await Withdrawal.findById(withdrawalId).session(session);
    if (!withdrawal || withdrawal.status !== WITHDRAWAL_STATUS.PROCESSING) {
      await session.abortTransaction();
      return;
    }

    withdrawal.status = WITHDRAWAL_STATUS.FAILED;
    withdrawal.failure_reason = reason;
    await withdrawal.save({ session });

    const reverted = await Wallet.findOneAndUpdate(
      { user_id: userId },
      {
        $inc: {
          available_balance: withdrawal.amount,
          total_withdrawn: -withdrawal.amount,
        },
      },
      { new: true, session }
    );

    await WalletTransaction.create(
      [
        {
          wallet_id: withdrawal.wallet_id,
          user_id: userId,
          type: WALLET_TX_TYPE.WITHDRAWAL_REVERSAL,
          amount: withdrawal.amount,
          balance_after: round2(reverted?.available_balance ?? 0),
          withdrawal_id: withdrawal._id,
          description: `Withdrawal reversed: ${reason}`,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    try {
      await NotificationServices.createNotificationIntoDB({
        user_id: userId,
        type: NOTIFICATION_TYPE.WITHDRAWAL_FAILED,
        title: 'Withdrawal Failed',
        message: `Your withdrawal of ${withdrawal.amount} ${withdrawal.currency} could not be processed and was refunded to your wallet.`,
        data: { amount: withdrawal.amount, reason },
      });
    } catch (err) {
      console.error('[wallet] payout-failed notification failed:', err);
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('[wallet] failAndReverse error:', error);
  } finally {
    await session.endSession();
  }
};

const getMyWithdrawals = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const wQuery = new QueryBuilder(
    Withdrawal.find({ user_id: userId }),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await wQuery.modelQuery;
  const meta = await wQuery.countTotal();
  return { meta, data };
};

// ** ---------- Admin ----------

const getAllWithdrawals = async (query: Record<string, unknown>) => {
  const wQuery = new QueryBuilder(
    Withdrawal.find().populate('user_id', 'full_name email phone_number'),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await wQuery.modelQuery;
  const meta = await wQuery.countTotal();
  return { meta, data };
};

/** Admin: retry a PROCESSING/FAILED payout (e.g. after enabling DPO payout). */
const retryPayout = async (withdrawalId: string) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) {
    throw new AppError(httpStatus.NOT_FOUND, 'Withdrawal not found');
  }
  if (withdrawal.status === WITHDRAWAL_STATUS.PAID) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Withdrawal already paid');
  }
  // If it previously FAILED, the balance was already reversed; re-run the debit
  // is out of scope — only PROCESSING items are safe to retry as-is.
  if (withdrawal.status !== WITHDRAWAL_STATUS.PROCESSING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only PROCESSING withdrawals can be retried'
    );
  }
  await attemptPayout(withdrawal._id, withdrawal.user_id);
  return Withdrawal.findById(withdrawalId);
};

const getCommission = async () => {
  const percentage = await getCommissionPercentage();
  return { percentage };
};

const updateCommission = async (percentage: number) => {
  if (percentage < 0 || percentage > 100) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Commission percentage must be between 0 and 100'
    );
  }
  const setting = await CommissionSetting.create({ percentage });
  return { percentage: setting.percentage };
};

export const WalletServices = {
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

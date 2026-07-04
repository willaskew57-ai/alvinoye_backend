import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';

import config from '../../../../config/env.config';
import {
  postToDpo,
  xmlEscape,
  DPO_RESULT,
  type DpoApiResponse,
} from '../../../../config/dpo';
import AppError from '../../../../errors/app-error';

import { Parcel } from '../parcel/parcel.model';
import User from '../user/user.model';
import { Payment } from './payment.model';
import { PAYMENT_STATUS } from './payment.constants';
import type { TUserPayload } from '../../../../interfaces';
import { NotificationServices } from '../notification/notification.service';
import { NOTIFICATION_TYPE } from '../notification/notification.constant';

export interface IDpoCheckoutResult {
  url: string;
  token: string;
}

export interface IDpoVerifyResult {
  status: PAYMENT_STATUS;
  paid: boolean;
  resultCode?: string | undefined;
  resultExplanation?: string | undefined;
}

/** Format a Date as DPO expects: "YYYY/MM/DD HH:MM". */
const formatDpoDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/**
 * 1️⃣ Create a DPO transaction token for a parcel and return the hosted
 * payment page URL the customer should be redirected to.
 */
export const createDpoCheckoutService = async (
  user: TUserPayload,
  parcelId: string
): Promise<IDpoCheckoutResult> => {
  const parcel = await Parcel.findOne({
    _id: parcelId,
    user_id: user.user_id,
  });

  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, 'Parcel not found');
  if (!parcel.final_price)
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel price not set');

  // Block double payment.
  const existingPayment = await Payment.findOne({
    parcel_id: parcel._id,
    user_id: parcel.user_id,
    status: PAYMENT_STATUS.SUCCESS,
  });
  if (existingPayment)
    throw new AppError(httpStatus.BAD_REQUEST, 'Parcel already paid');

  const amount = parcel.final_price.toFixed(2);
  const serviceDate = formatDpoDate(new Date());

  // Load the payer's profile so DPO fraud screening has real customer data.
  const dbUser = await User.findById(user.user_id).select(
    'full_name email phone_number address'
  );
  const fullName = (dbUser?.full_name || '').trim();
  const spaceIdx = fullName.indexOf(' ');
  const firstName = spaceIdx === -1 ? fullName : fullName.slice(0, spaceIdx);
  const lastName = spaceIdx === -1 ? '' : fullName.slice(spaceIdx + 1).trim();
  const email = dbUser?.email || user.email || '';
  const phone = dbUser?.phone_number || '';
  const address = dbUser?.address || '';

  // Only emit customer tags that actually have a value (empty tags can
  // themselves trip fraud rules).
  const customerTag = (tag: string, value: string) =>
    value ? `    <${tag}>${xmlEscape(value)}</${tag}>\n` : '';

  const customerXml =
    customerTag('customerEmail', email) +
    customerTag('customerFirstName', firstName) +
    customerTag('customerLastName', lastName) +
    customerTag('customerPhone', phone) +
    customerTag('customerAddress', address) +
    customerTag('customerCountry', config.dpo_country);

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${xmlEscape(config.dpo_company_token)}</CompanyToken>
  <Request>createToken</Request>
  <Transaction>
    <PaymentAmount>${xmlEscape(amount)}</PaymentAmount>
    <PaymentCurrency>${xmlEscape(config.dpo_currency)}</PaymentCurrency>
    <CompanyRef>${xmlEscape(parcel._id.toString())}</CompanyRef>
    <RedirectURL>${xmlEscape(config.dpo_redirect_url)}</RedirectURL>
    <BackURL>${xmlEscape(config.dpo_redirect_url)}</BackURL>
${customerXml}  </Transaction>
  <Services>
    <Service>
      <ServiceType>${xmlEscape(config.dpo_service_type)}</ServiceType>
      <ServiceDescription>${xmlEscape(
        `Parcel Payment - ${parcel.parcel_name}`
      )}</ServiceDescription>
      <ServiceDate>${xmlEscape(serviceDate)}</ServiceDate>
    </Service>
  </Services>
</API3G>`;

  const response: DpoApiResponse = await postToDpo(xml);

  if (response.Result !== DPO_RESULT.PAID || !response.TransToken) {
    console.error(
      '[DPO] createToken failed:',
      response.Result,
      response.ResultExplanation
    );
    throw new AppError(
      httpStatus.BAD_REQUEST,
      response.ResultExplanation || 'Failed to initialize payment'
    );
  }

  const token = response.TransToken;

  // Persist a PENDING payment keyed by the DPO token (unique transaction_id).
  await Payment.create({
    user_id: new Types.ObjectId(user.user_id),
    parcel_id: parcel._id,
    transaction_id: token,
    dpo_trans_ref: response.TransRef ?? null,
    transaction_amount: parcel.final_price,
    currency: config.dpo_currency,
    status: PAYMENT_STATUS.PENDING,
    payment_method: 'dpo',
    gateway: 'dpo',
  });

  return {
    url: `${config.dpo_payment_url}?ID=${encodeURIComponent(token)}`,
    token,
  };
};

/**
 * 2️⃣ Verify a DPO transaction (called when the customer returns via the
 * redirect/back URL). Confirms the payment server-to-server with DPO and
 * updates the local Payment record. Idempotent.
 */
export const verifyDpoPaymentService = async (params: {
  transToken?: string;
  companyRef?: string;
}): Promise<IDpoVerifyResult> => {
  // Resolve the payment either by the DPO token or by CompanyRef (parcel id),
  // since DPO's redirect may carry either one back to us.
  let payment = null;

  if (params.transToken) {
    payment = await Payment.findOne({
      transaction_id: params.transToken,
      gateway: 'dpo',
    });
  }

  if (!payment && params.companyRef) {
    payment = await Payment.findOne({
      parcel_id: params.companyRef,
      gateway: 'dpo',
    }).sort({ created_at: -1 });
  }

  if (!payment)
    throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');

  const transToken = payment.transaction_id;

  // Already finalized — return current state without re-processing.
  if (payment.status === PAYMENT_STATUS.SUCCESS) {
    return { status: PAYMENT_STATUS.SUCCESS, paid: true };
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${xmlEscape(config.dpo_company_token)}</CompanyToken>
  <Request>verifyToken</Request>
  <TransactionToken>${xmlEscape(transToken)}</TransactionToken>
</API3G>`;

  const response: DpoApiResponse = await postToDpo(xml);
  const resultCode = response.Result;
  const isPaid = resultCode === DPO_RESULT.PAID;

  if (!isPaid) {
    // Anything that is not "paid" and not still "pending at gateway" is failed.
    if (resultCode !== DPO_RESULT.NOT_PAID_YET) {
      payment.status = PAYMENT_STATUS.FAILED;
      await payment.save();

      try {
        await NotificationServices.createNotificationIntoDB({
          user_id: payment.user_id.toString(),
          type: NOTIFICATION_TYPE.PAYMENT_FAILED,
          title: 'Payment Failed',
          message: 'Your payment could not be completed.',
          parcel_id: payment.parcel_id.toString(),
          payment_id: payment._id,
          data: { amount: payment.transaction_amount },
        });
      } catch (error) {
        console.error('[DPO] Failed to create failure notification:', error);
      }
    }

    return {
      status: payment.status,
      paid: false,
      resultCode,
      resultExplanation: response.ResultExplanation,
    };
  }

  // Paid — mark success atomically (payment + parcel) like the Stripe flow.
  const dbSession = await mongoose.startSession();
  try {
    dbSession.startTransaction();

    const lockedPayment = await Payment.findById(payment._id).session(
      dbSession
    );
    if (!lockedPayment) {
      await dbSession.abortTransaction();
      throw new AppError(httpStatus.NOT_FOUND, 'Payment record not found');
    }

    // Re-check inside the transaction to stay idempotent under concurrency.
    if (lockedPayment.status === PAYMENT_STATUS.SUCCESS) {
      await dbSession.abortTransaction();
      return { status: PAYMENT_STATUS.SUCCESS, paid: true };
    }

    lockedPayment.status = PAYMENT_STATUS.SUCCESS;
    await lockedPayment.save({ session: dbSession });

    // Mark the parcel as paid so it becomes visible to drivers.
    await Parcel.updateOne(
      { _id: lockedPayment.parcel_id },
      { $set: { is_paid: true, paid_at: new Date() } },
      { session: dbSession }
    );

    await dbSession.commitTransaction();
  } catch (error) {
    await dbSession.abortTransaction();
    throw error;
  } finally {
    await dbSession.endSession();
  }

  try {
    await NotificationServices.createNotificationIntoDB({
      user_id: payment.user_id.toString(),
      type: NOTIFICATION_TYPE.PAYMENT_SUCCESS,
      title: 'Payment Successful',
      message: 'Payment for parcel has been successful.',
      parcel_id: payment.parcel_id.toString(),
      payment_id: payment._id,
      data: { amount: payment.transaction_amount },
    });
  } catch (error) {
    console.error('[DPO] Failed to create success notification:', error);
  }

  return { status: PAYMENT_STATUS.SUCCESS, paid: true, resultCode };
};

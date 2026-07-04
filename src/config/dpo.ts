import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import httpStatus from 'http-status';
import config from './env.config';
import AppError from '../errors/app-error';

/**
 * DPO Pay (DirectPay Online) low-level client.
 *
 * DPO exposes a single XML-over-HTTPS endpoint. Every request is an <API3G>
 * document containing the CompanyToken and a "Request" verb (createToken,
 * verifyToken, ...). The same endpoint serves both test and live traffic —
 * the CompanyToken decides which environment the call runs against.
 */

// DPO transaction-status result codes (subset we act on).
export const DPO_RESULT = {
  PAID: '000', // Transaction paid
  AUTHORIZED: '001', // Authorized (not yet captured)
  NOT_PAID_YET: '900', // Transaction not paid yet
  DECLINED: '901', // Transaction declined
  DATA_MISMATCH: '902',
  TIME_LIMIT_EXCEEDED: '903',
  CANCELLED: '904', // Transaction cancelled
} as const;

/**
 * Escape a value before embedding it inside the request XML so that customer
 * supplied data (names, emails) cannot break or inject into the document.
 */
export const xmlEscape = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const parser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
  // Keep everything as strings so result codes like "000" are not coerced to 0.
  parseTagValue: false,
});

export interface DpoApiResponse {
  Result?: string;
  ResultExplanation?: string;
  TransToken?: string;
  TransRef?: string;
  TransactionToken?: string;
  TransactionApproval?: string;
  TransactionAmount?: string;
  TransactionCurrency?: string;
  CustomerName?: string;
  [key: string]: unknown;
}

/**
 * POST an <API3G> XML body to DPO and return the parsed response node.
 * Throws an AppError on a misconfigured gateway or a network/transport failure.
 */
export const postToDpo = async (xml: string): Promise<DpoApiResponse> => {
  if (!config.dpo_company_token) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'DPO payment gateway is not configured'
    );
  }

  let raw: string;
  try {
    const response = await axios.post(config.dpo_api_url, xml, {
      headers: { 'Content-Type': 'application/xml' },
      timeout: 30000,
    });
    raw = response.data;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown transport error';
    console.error('[DPO] Request failed:', message);
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Unable to reach the payment gateway. Please try again.'
    );
  }

  const parsed = parser.parse(raw);
  const body = (parsed?.API3G ?? parsed) as DpoApiResponse;

  if (!body || typeof body !== 'object') {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      'Invalid response from the payment gateway'
    );
  }

  return body;
};

export interface IDpoPayoutParams {
  amount: number;
  currency: string;
  bank_name: string;
  account_number: string;
  account_holder_name: string;
  /** Our own reference (e.g. the Withdrawal id) so we can reconcile. */
  reference: string;
}

export interface IDpoPayoutResult {
  success: boolean;
  /** DPO-side reference for the disbursement, when available. */
  payoutRef?: string | undefined;
  resultCode?: string | undefined;
  resultExplanation?: string | undefined;
}

/**
 * Disburse (pay out) money from the merchant account to a driver's bank
 * account via DPO.
 *
 * NOTE: DPO's disbursement/payout product is separate from the standard
 * collection API and is not enabled on every merchant account. The exact
 * request verb and field names differ per account, so both the endpoint
 * (`DPO_PAYOUT_URL`) and the verb (`DPO_PAYOUT_REQUEST`) are env-driven and
 * this is the single place to adjust once the DPO payout spec is confirmed.
 *
 * If payout is not configured, this throws an AppError the caller catches so
 * the withdrawal stays in PROCESSING for manual/admin handling instead of
 * silently failing.
 */
export const createDpoPayout = async (
  params: IDpoPayoutParams
): Promise<IDpoPayoutResult> => {
  if (!config.dpo_payout_url) {
    throw new AppError(
      httpStatus.NOT_IMPLEMENTED,
      'DPO payout is not configured'
    );
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<API3G>
  <CompanyToken>${xmlEscape(config.dpo_company_token)}</CompanyToken>
  <Request>${xmlEscape(config.dpo_payout_request)}</Request>
  <Transaction>
    <PaymentAmount>${xmlEscape(params.amount.toFixed(2))}</PaymentAmount>
    <PaymentCurrency>${xmlEscape(params.currency)}</PaymentCurrency>
    <CompanyRef>${xmlEscape(params.reference)}</CompanyRef>
    <BankName>${xmlEscape(params.bank_name)}</BankName>
    <BankAccountNumber>${xmlEscape(params.account_number)}</BankAccountNumber>
    <BankAccountName>${xmlEscape(params.account_holder_name)}</BankAccountName>
  </Transaction>
</API3G>`;

  const response = await axios
    .post(config.dpo_payout_url, xml, {
      headers: { 'Content-Type': 'application/xml' },
      timeout: 30000,
    })
    .then((r) => r.data as string)
    .catch((error) => {
      const message =
        error instanceof Error ? error.message : 'Unknown transport error';
      console.error('[DPO] Payout request failed:', message);
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        'Unable to reach the payout gateway'
      );
    });

  const parsed = parser.parse(response);
  const body = (parsed?.API3G ?? parsed) as DpoApiResponse;
  const resultCode = body?.Result;
  const success = resultCode === DPO_RESULT.PAID;

  return {
    success,
    payoutRef: (body?.TransRef as string) ?? undefined,
    resultCode,
    resultExplanation: body?.ResultExplanation,
  };
};

export default { postToDpo, xmlEscape, DPO_RESULT, createDpoPayout };

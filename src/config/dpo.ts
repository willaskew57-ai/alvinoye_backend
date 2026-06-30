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

export default { postToDpo, xmlEscape, DPO_RESULT };

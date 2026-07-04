/**
 * DPO Pay (DirectPay Online) low-level client.
 *
 * DPO exposes a single XML-over-HTTPS endpoint. Every request is an <API3G>
 * document containing the CompanyToken and a "Request" verb (createToken,
 * verifyToken, ...). The same endpoint serves both test and live traffic —
 * the CompanyToken decides which environment the call runs against.
 */
export declare const DPO_RESULT: {
    readonly PAID: "000";
    readonly AUTHORIZED: "001";
    readonly NOT_PAID_YET: "900";
    readonly DECLINED: "901";
    readonly DATA_MISMATCH: "902";
    readonly TIME_LIMIT_EXCEEDED: "903";
    readonly CANCELLED: "904";
};
/**
 * Escape a value before embedding it inside the request XML so that customer
 * supplied data (names, emails) cannot break or inject into the document.
 */
export declare const xmlEscape: (value: unknown) => string;
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
export declare const postToDpo: (xml: string) => Promise<DpoApiResponse>;
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
export declare const createDpoPayout: (params: IDpoPayoutParams) => Promise<IDpoPayoutResult>;
declare const _default: {
    postToDpo: (xml: string) => Promise<DpoApiResponse>;
    xmlEscape: (value: unknown) => string;
    DPO_RESULT: {
        readonly PAID: "000";
        readonly AUTHORIZED: "001";
        readonly NOT_PAID_YET: "900";
        readonly DECLINED: "901";
        readonly DATA_MISMATCH: "902";
        readonly TIME_LIMIT_EXCEEDED: "903";
        readonly CANCELLED: "904";
    };
    createDpoPayout: (params: IDpoPayoutParams) => Promise<IDpoPayoutResult>;
};
export default _default;
//# sourceMappingURL=dpo.d.ts.map
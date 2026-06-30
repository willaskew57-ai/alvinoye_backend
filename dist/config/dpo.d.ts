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
};
export default _default;
//# sourceMappingURL=dpo.d.ts.map
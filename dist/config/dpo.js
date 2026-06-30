"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToDpo = exports.xmlEscape = exports.DPO_RESULT = void 0;
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
const http_status_1 = __importDefault(require("http-status"));
const env_config_1 = __importDefault(require("./env.config"));
const app_error_1 = __importDefault(require("../errors/app-error"));
/**
 * DPO Pay (DirectPay Online) low-level client.
 *
 * DPO exposes a single XML-over-HTTPS endpoint. Every request is an <API3G>
 * document containing the CompanyToken and a "Request" verb (createToken,
 * verifyToken, ...). The same endpoint serves both test and live traffic —
 * the CompanyToken decides which environment the call runs against.
 */
// DPO transaction-status result codes (subset we act on).
exports.DPO_RESULT = {
    PAID: '000', // Transaction paid
    AUTHORIZED: '001', // Authorized (not yet captured)
    NOT_PAID_YET: '900', // Transaction not paid yet
    DECLINED: '901', // Transaction declined
    DATA_MISMATCH: '902',
    TIME_LIMIT_EXCEEDED: '903',
    CANCELLED: '904', // Transaction cancelled
};
/**
 * Escape a value before embedding it inside the request XML so that customer
 * supplied data (names, emails) cannot break or inject into the document.
 */
const xmlEscape = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
exports.xmlEscape = xmlEscape;
const parser = new fast_xml_parser_1.XMLParser({
    ignoreAttributes: true,
    trimValues: true,
    // Keep everything as strings so result codes like "000" are not coerced to 0.
    parseTagValue: false,
});
/**
 * POST an <API3G> XML body to DPO and return the parsed response node.
 * Throws an AppError on a misconfigured gateway or a network/transport failure.
 */
const postToDpo = async (xml) => {
    if (!env_config_1.default.dpo_company_token) {
        throw new app_error_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'DPO payment gateway is not configured');
    }
    let raw;
    try {
        const response = await axios_1.default.post(env_config_1.default.dpo_api_url, xml, {
            headers: { 'Content-Type': 'application/xml' },
            timeout: 30000,
        });
        raw = response.data;
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown transport error';
        console.error('[DPO] Request failed:', message);
        throw new app_error_1.default(http_status_1.default.BAD_GATEWAY, 'Unable to reach the payment gateway. Please try again.');
    }
    const parsed = parser.parse(raw);
    const body = (parsed?.API3G ?? parsed);
    if (!body || typeof body !== 'object') {
        throw new app_error_1.default(http_status_1.default.BAD_GATEWAY, 'Invalid response from the payment gateway');
    }
    return body;
};
exports.postToDpo = postToDpo;
exports.default = { postToDpo: exports.postToDpo, xmlEscape: exports.xmlEscape, DPO_RESULT: exports.DPO_RESULT };
//# sourceMappingURL=dpo.js.map
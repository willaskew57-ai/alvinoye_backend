"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundPaymentSchema = exports.createCheckoutSchema = void 0;
const v3_1 = __importDefault(require("zod/v3"));
/**
 * Zod Schemas
 */
exports.createCheckoutSchema = v3_1.default.object({
    body: v3_1.default.object({
        parcel_id: v3_1.default.string().min(1, 'Parcel ID is required'),
    }),
});
exports.refundPaymentSchema = v3_1.default.object({
    body: v3_1.default.object({
        payment_id: v3_1.default.string().min(1, 'Payment ID is required'),
        reason: v3_1.default.string().optional(),
    }),
});
//# sourceMappingURL=payment.validation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRefundDecisionSchema = exports.requestRefundSchema = void 0;
const v3_1 = require("zod/v3");
exports.requestRefundSchema = v3_1.z.object({
    body: v3_1.z.object({
        reason: v3_1.z.string().min(5, 'Refund reason is required'),
    }),
});
exports.adminRefundDecisionSchema = v3_1.z.object({
    body: v3_1.z.object({
        action: v3_1.z.enum(['APPROVE', 'REJECT']),
        adminNote: v3_1.z.string().optional(),
    }),
});
//# sourceMappingURL=refund.validation.js.map
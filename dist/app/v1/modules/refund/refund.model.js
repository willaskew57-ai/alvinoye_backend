"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundRequest = void 0;
// refund.model.ts
const mongoose_1 = require("mongoose");
const refund_constants_1 = require("./refund.constants");
const refundSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    parcel_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Parcel', required: true },
    reason: { type: String, required: true },
    admin_note: { type: String, default: null },
    status: {
        type: String,
        enum: Object.values(refund_constants_1.REFUND_STATUS),
        default: refund_constants_1.REFUND_STATUS.PENDING,
    },
    stripe_refund_id: { type: String, default: null },
    refunded_at: { type: Date, default: null },
}, {
    timestamps: true,
});
exports.RefundRequest = (0, mongoose_1.model)('RefundRequest', refundSchema);
//# sourceMappingURL=refund.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_constants_1 = require("./payment.constants");
const paymentSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    parcel_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Parcel', required: true },
    transaction_id: { type: String, required: true, unique: true },
    transaction_amount: { type: mongoose_1.Schema.Types.Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
        type: String,
        enum: Object.values(payment_constants_1.PAYMENT_STATUS),
        default: payment_constants_1.PAYMENT_STATUS.PENDING,
    },
    payment_method: { type: String, default: 'card' },
    refund_id: { type: String, default: null },
    refunded_at: { type: Date, default: null },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
exports.Payment = (0, mongoose_1.model)('Payment', paymentSchema);
//# sourceMappingURL=payment.model.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = require("mongoose");
const OtpSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        index: true,
    },
    parcel: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        required: false,
        index: true,
    },
    otp_hash: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['REGISTER', 'RESET_PASSWORD', 'PARCEL'],
        required: true,
        index: true,
    },
    expires_at: {
        type: Date,
        required: false,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    is_used: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: false,
    },
});
OtpSchema.index({ expires_at: 1 }, {
    expireAfterSeconds: 0,
    partialFilterExpression: {
        expires_at: { $exists: true },
    },
});
exports.Otp = (0, mongoose_1.model)('Otp', OtpSchema);
exports.default = exports.Otp;
//# sourceMappingURL=otp.model.js.map
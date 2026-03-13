"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    parcel_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
        required: true,
        unique: true
    },
    customer_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    driver_id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
});
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
//# sourceMappingURL=review.model.js.map
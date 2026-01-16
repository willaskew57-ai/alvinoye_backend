import { Schema, model } from 'mongoose';
const reviewSchema = new Schema({
    parcel_id: {
        type: Schema.Types.ObjectId,
        ref: 'Parcel',
        required: true,
        unique: true // Prevents multiple reviews for the same parcel
    },
    customer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
}, { timestamps: true });
export const Review = model('Review', reviewSchema);
//# sourceMappingURL=review.model.js.map
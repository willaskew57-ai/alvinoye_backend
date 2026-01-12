import { Schema, model, Types } from 'mongoose';
const OtpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    otp_hash: {
        type: String,
        required: true,
    },
    purpose: {
        type: String,
        enum: ['REGISTER', 'RESET_PASSWORD'],
        required: true,
    },
    expires_at: {
        type: Date,
        required: true,
        index: { expires: 0 },
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
export const Otp = model('Otp', OtpSchema);
export default Otp;
//# sourceMappingURL=otp.model.js.map
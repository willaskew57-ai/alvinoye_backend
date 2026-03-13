"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notification_constant_1 = require("./notification.constant");
const NotificationSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true,
    },
    type: {
        type: String,
        enum: {
            values: Object.values(notification_constant_1.NOTIFICATION_TYPE),
            message: '{VALUE} is not a valid notification type',
        },
        required: [true, 'Notification type is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: Object.values(notification_constant_1.NOTIFICATION_STATUS),
            message: '{VALUE} is not a valid status',
        },
        default: notification_constant_1.NOTIFICATION_STATUS.UNREAD,
    },
    priority: {
        type: String,
        enum: {
            values: Object.values(notification_constant_1.NOTIFICATION_PRIORITY),
            message: '{VALUE} is not a valid priority',
        },
        default: notification_constant_1.NOTIFICATION_PRIORITY.MEDIUM,
    },
    // Related References
    parcel_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Parcel',
    },
    price_request_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ParcelPriceRequest',
    },
    payment_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    chat_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    // Metadata
    action_url: {
        type: String,
        trim: true,
    },
    data: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    // Timestamps
    read_at: {
        type: Date,
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
// Indexes for performance
NotificationSchema.index({ user_id: 1, status: 1 });
NotificationSchema.index({ user_id: 1, created_at: -1 });
NotificationSchema.index({ created_at: -1 });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map
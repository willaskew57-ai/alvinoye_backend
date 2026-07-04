"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WITHDRAWAL_STATUS = exports.WALLET_TX_TYPE = void 0;
// Wallet transaction types
exports.WALLET_TX_TYPE = {
    EARNING: 'EARNING', // parcel completed -> credited to pending
    DISTRIBUTION: 'DISTRIBUTION', // weekly job -> pending moved to available
    WITHDRAWAL: 'WITHDRAWAL', // driver withdrew -> available debited
    WITHDRAWAL_REVERSAL: 'WITHDRAWAL_REVERSAL', // payout failed -> refunded
};
exports.WITHDRAWAL_STATUS = {
    PROCESSING: 'PROCESSING', // debited, payout attempt in progress / awaiting admin
    PAID: 'PAID', // payout succeeded
    FAILED: 'FAILED', // payout failed, balance reversed
};
//# sourceMappingURL=wallet.interface.js.map
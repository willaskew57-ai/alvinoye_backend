"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICE_REQUEST_STATUS = exports.PROPOSED_BY = exports.PRICE_TYPE = exports.PRICE_STATUS = exports.PARCEL_STATUS = void 0;
exports.PARCEL_STATUS = {
    INITIAL: 'INITIAL',
    WAITING: 'WAITING',
    PENDING: 'PENDING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    REJECTED: 'REJECTED',
};
exports.PRICE_STATUS = {
    NOT_SET: 'NOT_SET',
    PROPOSED: 'PROPOSED',
    COUNTERED: 'COUNTERED',
    FINAL_OFFER: 'FINAL_OFFER',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
exports.PRICE_TYPE = {
    PROPOSED: 'PROPOSED',
    COUNTERED: 'COUNTERED',
    FINAL_OFFER: 'FINAL_OFFER',
};
exports.PROPOSED_BY = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
};
exports.PRICE_REQUEST_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
//# sourceMappingURL=parcel.interface.js.map
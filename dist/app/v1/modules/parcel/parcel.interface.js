import { Types, Document } from 'mongoose';
// Enums as Constants
export const PARCEL_STATUS = {
    WAITING: 'WAITING',
    PENDING: 'PENDING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    REJECTED: 'REJECTED',
};
export const PRICE_STATUS = {
    NOT_SET: 'NOT_SET',
    PROPOSED: 'PROPOSED',
    COUNTERED: 'COUNTERED',
    FINAL_OFFER: 'FINAL_OFFER',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
export const PRICE_TYPE = {
    PROPOSED: 'PROPOSED',
    COUNTERED: 'COUNTERED',
    FINAL_OFFER: 'FINAL_OFFER',
};
export const PROPOSED_BY = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
};
export const PRICE_REQUEST_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
//# sourceMappingURL=parcel.interface.js.map
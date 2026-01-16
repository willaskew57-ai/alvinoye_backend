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
    NOT_SET: 'NOT_SET', // Initial creation
    PROPOSED: 'PROPOSED', // Admin's first price
    COUNTERED: 'COUNTERED', // User's counter offer
    FINAL_OFFER: 'FINAL_OFFER', // Admin's second and last price offer
    ACCEPTED: 'ACCEPTED', // Negotiation successful
    REJECTED: 'REJECTED', // Negotiation failed
};
export const PROPOSED_BY = {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
};
export const PRICE_REQUEST_STATUS = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
//# sourceMappingURL=parcel.interface.js.map
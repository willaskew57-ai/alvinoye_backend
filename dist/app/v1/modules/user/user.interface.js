import { Model, Types } from 'mongoose';
// Enums as Constants
export const USER_ROLE = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    DRIVER: 'DRIVER',
};
export const USER_STATUS = {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    BLOCKED: 'BLOCKED',
    REMOVED: 'REMOVED',
    DELETED: 'DELETED',
};
//# sourceMappingURL=user.interface.js.map
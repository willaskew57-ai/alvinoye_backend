"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerServices = void 0;
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const query_builder_1 = __importDefault(require("../../../../builders/query-builder"));
const getAllUsersFromDB = async (query) => {
    const userSearchableFields = ['full_name', 'email'];
    const baseQuery = user_model_1.User.find({
        role: { $in: [user_interface_1.USER_ROLE.CUSTOMER] },
        status: { $in: [user_interface_1.USER_STATUS.ACTIVE, user_interface_1.USER_STATUS.BLOCKED] },
    });
    const userQuery = new query_builder_1.default(baseQuery, query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const data = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return {
        meta,
        data,
    };
};
exports.CustomerServices = {
    getAllUsersFromDB,
};
//# sourceMappingURL=customer.service.js.map
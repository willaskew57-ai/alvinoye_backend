import httpStatus from 'http-status';
import AppError from '../../../../errors/app-error';
import { User } from '../user/user.model';
import { USER_ROLE, USER_STATUS } from '../user/user.interface';
import QueryBuilder from '../../../../builders/query-builder';
const getAllUsersFromDB = async (query) => {
    const userSearchableFields = ['full_name', 'email'];
    const baseQuery = User.find({
        role: { $in: [USER_ROLE.CUSTOMER] },
        status: { $in: [USER_STATUS.ACTIVE, USER_STATUS.BLOCKED] }
    });
    const userQuery = new QueryBuilder(baseQuery, query)
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
const deleteUserFromDB = async (id) => {
    const result = await User.findByIdAndUpdate(id, { status: 'DELETED', deleted_date: new Date() }, { new: true });
    if (!result)
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    return result;
};
export const CustomerServices = {
    getAllUsersFromDB,
    deleteUserFromDB,
};
//# sourceMappingURL=customer.service.js.map
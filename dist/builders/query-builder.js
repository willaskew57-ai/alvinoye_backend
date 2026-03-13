"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    modelQuery;
    query;
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchFields) {
        const searchTerm = this.query.searchTerm || '';
        this.modelQuery = this.modelQuery.find({
            $or: searchFields.map((field) => {
                return {
                    [field]: { $regex: searchTerm, $options: 'i' },
                };
            }),
        });
        return this;
    }
    filter() {
        const queryObject = { ...this.query };
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObject[el]);
        this.modelQuery = this.modelQuery.find(queryObject);
        return this;
    }
    sort() {
        const sort = this.query.sort
            ? this?.query?.sort?.split(',')?.join(' ')
            : '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        const limit = Number(this.query.limit) || 10;
        const page = Number(this.query.page) || 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        const fields = this?.query?.fields?.split(',')?.join(' ') || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    //  ** Count Total :
    async countTotal() {
        const filter = this.modelQuery.getFilter();
        const total = await this.modelQuery.model.countDocuments(filter);
        //  ** page :
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPages = Math.ceil(total / limit);
        return {
            total,
            page,
            limit,
            totalPages,
        };
    }
}
exports.default = QueryBuilder;
//# sourceMappingURL=query-builder.js.map
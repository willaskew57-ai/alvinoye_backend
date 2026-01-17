import { Query } from "mongoose";
class QueryBuilder {
    modelQuery;
    query;
    // create a constructor to assign modelQuery and query:
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    // create a search  method:
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
    // create a filter method:
    filter() {
        // copy the query:
        const queryObject = { ...this.query };
        // excluding fields array:
        const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
        //exclude now :
        excludeFields.forEach((el) => delete queryObject[el]);
        //filter now :
        this.modelQuery = this.modelQuery.find(queryObject);
        return this;
    }
    // create as sort function :
    sort() {
        const sort = this.query.sort
            ? this?.query?.sort?.split(',')?.join(' ')
            : '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    // paginate method:
    paginate() {
        const limit = Number(this.query.limit) || 10;
        const page = Number(this.query.page) || 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    // select fields method :
    fields() {
        const fields = this?.query?.fields?.split(',')?.join(' ') || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    //  ** Count Total :
    async countTotal() {
        const filter = this.modelQuery.getFilter();
        // console.log(filter);
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
export default QueryBuilder;
//# sourceMappingURL=query-builder.js.map
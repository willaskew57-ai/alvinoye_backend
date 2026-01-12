import { Query } from "mongoose";
declare class QueryBuilder<T> {
    modelQuery: Query<T[], T>;
    query: Record<string, unknown>;
    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>);
    search(searchFields: string[]): this;
    filter(): this;
    sort(): this;
    paginate(): this;
    fields(): this;
    countTotal(): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
export default QueryBuilder;
//# sourceMappingURL=QueryBuilder.d.ts.map
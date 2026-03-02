import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchFields: string[]) {
    const searchTerm: string = (this.query.searchTerm as string) || '';
    this.modelQuery = this.modelQuery.find({
      $or: searchFields.map((field: string) => {
        return {
          [field]: { $regex: searchTerm, $options: 'i' },
        };
      }),
    } as any);

    return this;
  }

  filter() {
    const queryObject = { ...this.query };

    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    excludeFields.forEach((el: string) => delete queryObject[el]);

    this.modelQuery = this.modelQuery.find(queryObject as any);

    return this;
  }

  sort() {
    const sort = this.query.sort
      ? (this?.query?.sort as string)?.split(',')?.join(' ')
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
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

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

export default QueryBuilder;

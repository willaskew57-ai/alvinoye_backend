export declare const CustomerServices: {
    getAllUsersFromDB: (query: Record<string, unknown>) => Promise<{
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        data: (import("mongoose").Document<unknown, {}, import("../user/user.interface").TUser, {}, import("mongoose").DefaultSchemaOptions> & import("../user/user.interface").TUser & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
};
//# sourceMappingURL=customer.service.d.ts.map
export declare const getDashboardStatsFromDB: () => Promise<{
    totalUsers: number;
    totalDrivers: number;
    totalIncome: any;
    totalDeliveries: number;
}>;
export declare const getParcelMovementStatsFromDB: (queryYear?: string) => Promise<{
    year: number;
    availableYears: any[];
    stats: {
        month: string;
        parcels: any;
    }[];
}>;
export declare const getParcelOwnerGrowthFromDB: (queryYear?: string) => Promise<{
    selectedYear: any;
    availableYears: any[];
    stats: {
        name: string;
        active: any;
        inactive: any;
    }[];
}>;
//# sourceMappingURL=dashboard.service.d.ts.map
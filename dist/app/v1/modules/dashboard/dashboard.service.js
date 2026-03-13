"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParcelOwnerGrowthFromDB = exports.getParcelMovementStatsFromDB = exports.getDashboardStatsFromDB = void 0;
const parcel_interface_1 = require("../parcel/parcel.interface");
const parcel_model_1 = require("../parcel/parcel.model");
const payment_constants_1 = require("../payment/payment.constants");
const payment_model_1 = require("../payment/payment.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = __importDefault(require("../user/user.model"));
const getDashboardStatsFromDB = async () => {
    const [totalUsers, totalDrivers, incomeData, totalDeliveries] = await Promise.all([
        user_model_1.default.countDocuments({ deleted_date: { $exists: false } }),
        user_model_1.default.countDocuments({
            role: user_interface_1.USER_ROLE.DRIVER,
            deleted_date: { $exists: false },
        }),
        payment_model_1.Payment.aggregate([
            { $match: { status: payment_constants_1.PAYMENT_STATUS.SUCCESS } }, // Only count completed payments
            { $group: { _id: null, totalIncome: { $sum: '$transaction_amount' } } },
        ]),
        parcel_model_1.Parcel.countDocuments({ status: parcel_interface_1.PARCEL_STATUS.COMPLETED }),
    ]);
    return {
        totalUsers,
        totalDrivers,
        totalIncome: incomeData.length > 0 ? incomeData[0].totalIncome : 0,
        totalDeliveries,
    };
};
exports.getDashboardStatsFromDB = getDashboardStatsFromDB;
const getParcelMovementStatsFromDB = async (queryYear) => {
    const currentYear = new Date().getFullYear();
    const selectedYear = queryYear ? parseInt(queryYear) : currentYear;
    const availableYears = await parcel_model_1.Parcel.aggregate([
        {
            $group: {
                _id: { $year: '$createdAt' },
            },
        },
        { $sort: { _id: -1 } },
    ]).then((res) => res.map((item) => item._id).filter(Boolean));
    const monthlyStats = await parcel_model_1.Parcel.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(`${selectedYear}-01-01`),
                    $lte: new Date(`${selectedYear}-12-31T23:59:59`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'July',
        'Augt',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ];
    const chartData = monthNames.map((month, index) => {
        const monthData = monthlyStats.find((item) => item._id === index + 1);
        return {
            month,
            parcels: monthData ? monthData.count : 0,
        };
    });
    return {
        year: selectedYear,
        availableYears: availableYears.length > 0 ? availableYears : [currentYear],
        stats: chartData,
    };
};
exports.getParcelMovementStatsFromDB = getParcelMovementStatsFromDB;
const getParcelOwnerGrowthFromDB = async (queryYear) => {
    const currentYear = new Date().getFullYear();
    const availableYearsResult = await user_model_1.default.aggregate([
        { $match: { role: user_interface_1.USER_ROLE.CUSTOMER } },
        {
            $group: {
                _id: { $year: '$created_at' },
            },
        },
        { $sort: { _id: -1 } },
    ]);
    const availableYears = availableYearsResult
        .map((item) => item._id)
        .filter(Boolean);
    const selectedYear = queryYear
        ? parseInt(queryYear)
        : availableYears[0] || currentYear;
    const growthStats = await user_model_1.default.aggregate([
        {
            $match: {
                role: user_interface_1.USER_ROLE.CUSTOMER,
                created_at: {
                    $gte: new Date(`${selectedYear}-01-01`),
                    $lte: new Date(`${selectedYear}-12-31T23:59:59`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$created_at' },
                activeCount: {
                    $sum: {
                        $cond: [{ $eq: ['$status', user_interface_1.USER_STATUS.ACTIVE] }, 1, 0],
                    },
                },
                inactiveCount: {
                    $sum: {
                        $cond: [
                            {
                                $in: [
                                    '$status',
                                    [
                                        user_interface_1.USER_STATUS.BLOCKED,
                                        user_interface_1.USER_STATUS.REJECTED,
                                        user_interface_1.USER_STATUS.DELETED,
                                    ],
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'July',
        'Augt',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
    ];
    const stats = monthNames.map((month, index) => {
        const monthData = growthStats.find((item) => item._id === index + 1);
        return {
            name: month,
            active: monthData ? monthData.activeCount : 0,
            inactive: monthData ? monthData.inactiveCount : 0,
        };
    });
    return {
        selectedYear,
        availableYears: availableYears.length > 0 ? availableYears : [currentYear],
        stats,
    };
};
exports.getParcelOwnerGrowthFromDB = getParcelOwnerGrowthFromDB;
//# sourceMappingURL=dashboard.service.js.map
import { PARCEL_STATUS } from '../parcel/parcel.interface';
import { Parcel } from '../parcel/parcel.model';
import { PAYMENT_STATUS } from '../payment/payment.constants';
import { Payment } from '../payment/payment.model';
import { USER_ROLE, USER_STATUS } from '../user/user.interface';
import User from '../user/user.model';

export const getDashboardStatsFromDB = async () => {
  const [totalUsers, totalDrivers, incomeData, totalDeliveries] =
    await Promise.all([
      User.countDocuments({ deleted_date: { $exists: false } }),

      User.countDocuments({
        role: USER_ROLE.DRIVER,
        deleted_date: { $exists: false },
      }),

      Payment.aggregate([
        { $match: { status: PAYMENT_STATUS.SUCCESS } }, // Only count completed payments
        { $group: { _id: null, totalIncome: { $sum: '$transaction_amount' } } },
      ]),

      Parcel.countDocuments({ status: PARCEL_STATUS.COMPLETED }),
    ]);

  return {
    totalUsers,
    totalDrivers,
    totalIncome: incomeData.length > 0 ? incomeData[0].totalIncome : 0,
    totalDeliveries,
  };
};

export const getParcelMovementStatsFromDB = async (queryYear?: string) => {
  const currentYear = new Date().getFullYear();
  const selectedYear = queryYear ? parseInt(queryYear) : currentYear;

  const availableYears = await Parcel.aggregate([
    {
      $group: {
        _id: { $year: '$createdAt' },
      },
    },
    { $sort: { _id: -1 } },
  ]).then((res) => res.map((item) => item._id).filter(Boolean));

  const monthlyStats = await Parcel.aggregate([
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

export const getParcelOwnerGrowthFromDB = async (queryYear?: string) => {
  const currentYear = new Date().getFullYear();

  const availableYearsResult = await User.aggregate([
    { $match: { role: USER_ROLE.CUSTOMER } },
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

  const growthStats = await User.aggregate([
    {
      $match: {
        role: USER_ROLE.CUSTOMER,
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
            $cond: [{ $eq: ['$status', USER_STATUS.ACTIVE] }, 1, 0],
          },
        },
        inactiveCount: {
          $sum: {
            $cond: [
              {
                $in: [
                  '$status',
                  [
                    USER_STATUS.BLOCKED,
                    USER_STATUS.REJECTED,
                    USER_STATUS.DELETED,
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

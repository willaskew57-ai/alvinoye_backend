import express from 'express';

import { auth } from '../../../../middleware/auth';
import validateRequest from '../../../../middleware/validate-request';
import { USER_ROLE } from '../user/user.interface';
import { WalletController } from './wallet.controller';
import { WalletValidation } from './wallet.validation';

const router = express.Router();

// ** ---------- Driver ----------
router.get('/me', auth(USER_ROLE.DRIVER), WalletController.getMyWallet);

router.get(
  '/transactions',
  auth(USER_ROLE.DRIVER),
  WalletController.getMyTransactions
);

router.post(
  '/withdraw',
  auth(USER_ROLE.DRIVER),
  validateRequest(WalletValidation.withdrawSchema),
  WalletController.withdraw
);

router.get(
  '/withdrawals',
  auth(USER_ROLE.DRIVER),
  WalletController.getMyWithdrawals
);

// ** ---------- Admin ----------
router.get(
  '/admin/withdrawals',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  WalletController.getAllWithdrawals
);

router.patch(
  '/admin/withdrawals/:id/retry',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  WalletController.retryPayout
);

router.get(
  '/admin/commission',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  WalletController.getCommission
);

router.patch(
  '/admin/commission',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(WalletValidation.updateCommissionSchema),
  WalletController.updateCommission
);

export const WalletRoutes = router;

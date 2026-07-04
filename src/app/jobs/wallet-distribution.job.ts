import cron from 'node-cron';
import colors from 'colors';

import config from '../../config/env.config';
import { WalletServices } from '../v1/modules/wallet/wallet.service';

/**
 * Schedule the weekly payout distribution: moves every driver's PENDING
 * earnings into their AVAILABLE (withdrawable) balance. Runs on the schedule
 * defined by WALLET_DISTRIBUTION_CRON (default: every Sunday 00:00).
 */
export const startWalletDistributionCron = (): void => {
  const expression = config.wallet_distribution_cron;

  if (!cron.validate(expression)) {
    console.error(
      colors.red(
        `[wallet] Invalid WALLET_DISTRIBUTION_CRON "${expression}"; cron not started`
      )
    );
    return;
  }

  cron.schedule(expression, async () => {
    console.log(colors.cyan('[wallet] Running weekly distribution...'));
    try {
      await WalletServices.distributeWeekly();
    } catch (error) {
      console.error('[wallet] Weekly distribution job failed:', error);
    }
  });

  console.log(
    colors.green(`[wallet] Distribution cron scheduled: "${expression}"`)
  );
};

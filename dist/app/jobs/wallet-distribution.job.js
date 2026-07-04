"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startWalletDistributionCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const colors_1 = __importDefault(require("colors"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const wallet_service_1 = require("../v1/modules/wallet/wallet.service");
/**
 * Schedule the weekly payout distribution: moves every driver's PENDING
 * earnings into their AVAILABLE (withdrawable) balance. Runs on the schedule
 * defined by WALLET_DISTRIBUTION_CRON (default: every Sunday 00:00).
 */
const startWalletDistributionCron = () => {
    const expression = env_config_1.default.wallet_distribution_cron;
    if (!node_cron_1.default.validate(expression)) {
        console.error(colors_1.default.red(`[wallet] Invalid WALLET_DISTRIBUTION_CRON "${expression}"; cron not started`));
        return;
    }
    node_cron_1.default.schedule(expression, async () => {
        console.log(colors_1.default.cyan('[wallet] Running weekly distribution...'));
        try {
            await wallet_service_1.WalletServices.distributeWeekly();
        }
        catch (error) {
            console.error('[wallet] Weekly distribution job failed:', error);
        }
    });
    console.log(colors_1.default.green(`[wallet] Distribution cron scheduled: "${expression}"`));
};
exports.startWalletDistributionCron = startWalletDistributionCron;
//# sourceMappingURL=wallet-distribution.job.js.map
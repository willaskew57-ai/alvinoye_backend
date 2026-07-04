"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
// ** import local files
const express_app_1 = __importDefault(require("./express-app"));
const env_config_1 = __importDefault(require("./config/env.config"));
const db_1 = require("./db");
const seed_super_admin_1 = require("./db/seed-super-admin");
const socket_1 = require("./socket");
const wallet_distribution_job_1 = require("./app/jobs/wallet-distribution.job");
require("dotenv/config");
let server;
async function main() {
    try {
        await (0, db_1.connectDB)();
        console.log(colors_1.default.blue(`Database is Connected Successfully!!!`).bold);
        await (0, seed_super_admin_1.seedSuperAdmin)();
        server = express_app_1.default.listen(env_config_1.default.port, () => {
            console.log(colors_1.default.green(`The Server is running on ${env_config_1.default.port}`).bold);
        });
        (0, socket_1.initSocket)(server);
        (0, wallet_distribution_job_1.startWalletDistributionCron)();
    }
    catch (err) {
        console.log(err);
    }
}
main();
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason, promise);
    console.log(colors_1.default.red(`Server detected UnHandledRejection 😡`));
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log(colors_1.default.red(`Server detected unCaughtException 😡`));
    process.exit(1);
});
//# sourceMappingURL=server.js.map
// ** imports packages
import { Server } from 'http';
import colors from 'colors';

// ** import local files
import app from './express-app';
import configs from './config/env.config';
import { connectDB } from './db';
import { seedSuperAdmin } from './db/seed-super-admin';
import { initSocket } from './socket';
import { startWalletDistributionCron } from './app/jobs/wallet-distribution.job';
import 'dotenv/config';

let server: Server;

async function main() {
  try {
    await connectDB();
    console.log(colors.blue(`Database is Connected Successfully!!!`).bold);
    await seedSuperAdmin();
    server = app.listen(configs.port, () => {
      console.log(
        colors.green(`The Server is running on ${configs.port}`).bold
      );
    });

    initSocket(server);
    startWalletDistributionCron();
  } catch (err) {
    console.log(err);
  }
}
main();

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise);
  console.log(colors.red(`Server detected UnHandledRejection 😡`));
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(colors.red(`Server detected unCaughtException 😡`));
  process.exit(1);
});

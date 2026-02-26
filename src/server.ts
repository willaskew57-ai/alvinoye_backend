// ** imports packages
import { Server } from 'http';
import colors from 'colors';

// ** import local files
import app from './app';
import configs from './config/env.config';
import { connectDB } from './db';
import { initSocket } from './socket';

let server: Server;

async function main() {
  try {
    await connectDB();  // ✅ Add await
    console.log(colors.blue(`Database is Connected Successfully!!!`).bold);
    server = app.listen(configs.port, () => {
      console.log(
        colors.green(`The Server is running on ${configs.port}`).bold
      );
    });

    // 🔥 initialize socket after server starts
    initSocket(server);
  } catch (err) {
    console.log(err);
  }
}
main();

// handle unhandledRejection for asynchronous error:
process.on('unhandledRejection', (reason, 
  promise) => {
  console.log(reason, promise);
  console.log(colors.red(`Server detected UnHandledRejection 😡`));
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// handle unCaughtException Error :
process.on('uncaughtException', () => {
  console.log(colors.red(`Server detected unCaughtException 😡`));
  process.exit(1);
});

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS for SRV resolution

/* eslint-disable no-console */
import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_URL as string, {
      serverSelectionTimeoutMS: 5000, // Fall after 5 seconds instead of waiting indefinitely
    });

    server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`App is listening on port http://localhost:${config.port}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(
    '😈😈Unhandled rejection Detected 😈 shutting down the server...💤💤💤💤💤',
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', () => {
  console.log(
    'Uncaught Exception Detected 😈 shutting down the server...💤💤💤💤💤',
  );
  process.exit(1);
});

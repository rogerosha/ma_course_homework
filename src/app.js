const server = require('./server');
const db = require('./db/pg');

function enableGracefulExit() {
  const exitHandler = async (error) => {
    if (error) console.error(error);

    console.log('Gracefully stopping...');
    await db.end();
    server.stop(() => {
      process.exit();
    });
    process.exit(1);
  };

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  process.on('uncaughtException', exitHandler);
  process.on('unhandledRejection', exitHandler);
}

function boot() {
  enableGracefulExit();
  server.start();
}

boot();

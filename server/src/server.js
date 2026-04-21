const http = require('http');
const { app } = require('./app');
const { env } = require('./config/env');
const { dataSource } = require('./config/database');
const { initSocket } = require('./socket/socket-server');

const bootstrap = async () => {
  await dataSource.initialize();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server', error);
  process.exit(1);
});

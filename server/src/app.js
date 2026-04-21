const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { env } = require('./config/env');
const { apiRouter } = require('./routes');
const { notFoundHandler } = require('./common/middleware/not-found');
const { errorHandler } = require('./common/middleware/error-handler');

const app = express();

app.use(
  cors({
    origin: env.clientOrigin
  })
);
app.use(compression());
app.use(express.json());

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };

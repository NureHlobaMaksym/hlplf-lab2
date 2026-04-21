const dotenv = require('dotenv');

dotenv.config();

const toBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return value === 'true';
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'lab2_super_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hlplf_lab2',
    synchronize: toBoolean(process.env.DB_SYNCHRONIZE, true),
    logging: toBoolean(process.env.DB_LOGGING, false)
  }
};

module.exports = { env };

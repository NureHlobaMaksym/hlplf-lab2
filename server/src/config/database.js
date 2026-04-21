require('reflect-metadata');
const { DataSource } = require('typeorm');
const { env } = require('./env');
const { entities } = require('./entities');

const dataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: env.db.synchronize,
  logging: env.db.logging,
  entities
});

module.exports = { dataSource };

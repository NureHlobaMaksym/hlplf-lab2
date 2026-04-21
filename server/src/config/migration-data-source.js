require('reflect-metadata');
const path = require('path');
const { DataSource } = require('typeorm');
const { env } = require('./env');
const { entities } = require('./entities');

const migrationDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: env.db.logging,
  entities,
  migrations: [path.join(__dirname, '../migrations/*.js')]
});

module.exports = migrationDataSource;

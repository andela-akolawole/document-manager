
const dotenv = require('dotenv').config();

const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    options: {
      host: 'localhost',
      pool: {
        max: 5,
        min: 0,
        idle: 20000,
      },
      port: 5432,
      dailect: 'postgres',
    },
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  test: {
    username: 'postgres',
    password: process.env.TEST_DB_PASS || null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
};

export default config;

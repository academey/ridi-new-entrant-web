require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: 'localhost', // 로컬로 접근할 수 있는 mariadb 가 켜져있어야 함.
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-9',
    },
    timezone: 'Etc/GMT-9',
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-9',
    },
    timezone: 'Etc/GMT-9',
    define: {
      freezeTableName: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-9',
    },
    timezone: 'Etc/GMT-9',
    define: {
      freezeTableName: true,
    },
  },
};

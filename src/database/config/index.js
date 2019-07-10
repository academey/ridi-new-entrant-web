require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT+9',
    },
    timezone: 'Etc/GMT+9',
    define: {
      freezeTableName: true,
      underscored: true,
    },
  },
  test: {
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT+9',
    },
    timezone: 'Etc/GMT+9',
    define: {
      freezeTableName: true,
      underscored: true,
    },
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT+9',
    },
    timezone: 'Etc/GMT+9',
    define: {
      freezeTableName: true,
      underscored: true,
    },
    logging: false,
  },
};

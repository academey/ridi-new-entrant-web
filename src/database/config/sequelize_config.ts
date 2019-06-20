import { SequelizeOptions } from 'sequelize-typescript';

export interface SequelizeConfig {
  [index: string]: SequelizeOptions;
  development: SequelizeOptions;
  test: SequelizeOptions;
  production: SequelizeOptions;
}

const sequelizeConfigs: SequelizeConfig = {
  development: {
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
    modelPaths: ['./models/*.ts'],
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
    modelPaths: ['src/database/models/*.ts'],
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
    modelPaths: ['src/database/models/*.ts'],
  },
};

export default sequelizeConfigs;

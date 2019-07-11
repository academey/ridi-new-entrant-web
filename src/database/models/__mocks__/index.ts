// @ts-ignore
import Sequelize = require('sequelize-mock');

const sequelize = new Sequelize();

const db = {
  sequelize,
  Sequelize,
};

export default db;

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Book', [{
      name: 'John Doe',
      desc: "test",
      createdAt:'2018-12-04',
      updatedAt:'2018-12-04',
    },
      {
        name: 'John Doe',
        desc: "test",
        createdAt:'2018-12-04',
        updatedAt:'2018-12-04',
      }
      ,{
        name: 'John Doe',
        desc: "test",
        createdAt:'2018-12-04',
        updatedAt:'2018-12-04',
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Book', null, {});
  }
};
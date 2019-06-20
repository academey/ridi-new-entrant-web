"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert("User", [{
      email: "a@b.c",
      password: "password",
      createdAt: "2018-12-04",
      updatedAt: "2018-12-04",
    },
      {
        email: "b@b.c",
        password: "passwordword",
        createdAt: "2018-12-04",
        updatedAt: "2018-12-04",
      }
      , {
        email: "c@b.c",
        password: "passwordword",
        createdAt: "2018-12-04",
        updatedAt: "2018-12-04",
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("User", null, {});

  },
};

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
    return queryInterface.bulkInsert("author", [{
      name: "John Doe",
      desc: "hihi",
      created_at: "2018-12-04",
      updated_at: "2018-12-04",
    },
      {
        name: "John Doe",
        desc: "hihihihi",
        created_at: "2018-12-04",
        updated_at: "2018-12-04",
      }
      , {
        name: "John Doe",
        desc: "hihihihihihihi",
        created_at: "2018-12-04",
        updated_at: "2018-12-04",
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("author", null, {});
  },
};

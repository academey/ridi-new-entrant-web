"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("book", [{
      name: "John Doe",
      desc: "test",
      created_at: "2018-12-04",
      updated_at: "2018-12-04",
    },
      {
        name: "John Doe",
        desc: "test",
        created_at: "2018-12-04",
        updated_at: "2018-12-04",
      }
      , {
        name: "John Doe",
        desc: "test",
        created_at: "2018-12-04",
        updated_at: "2018-12-04",
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("book", null, {});
  },
};

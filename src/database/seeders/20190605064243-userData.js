"use strict";
const bcrypt = require('bcrypt');
const samplePassword = 'password';

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
    return bcrypt.hash(samplePassword, 12).then((hashedPassword)=>{
      return queryInterface.bulkInsert("user", [{
        email: "email@gmail.com",
        password: hashedPassword,
        created_at: "2018-12-04",
        updated_at: "2018-12-04",
      },
        {
          email: "email2@gmail.com",
          password: hashedPassword,
          created_at: "2018-12-04",
          updated_at: "2018-12-04",
        }
        , {
          email: "email3@gmail.com",
          password: hashedPassword,
          created_at: "2018-12-04",
          updated_at: "2018-12-04",
        }], {});
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete("user", null, {});

  },
};

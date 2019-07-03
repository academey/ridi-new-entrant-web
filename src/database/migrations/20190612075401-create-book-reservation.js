"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("book_reservation", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type : Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'user',
          },
          key: 'id'
        },
      },
      book_id: {
        type : Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'book',
          },
          key: 'id'
        },
      },
      end_at: {
        type : Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("book_reservation");
  },

};

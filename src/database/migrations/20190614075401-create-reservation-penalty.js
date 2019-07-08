"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("reservation_penalty", {
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
      book_reservation_id: {
        type : Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'book_reservation',
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
    return queryInterface.dropTable("reservation_penalty");
  },

};

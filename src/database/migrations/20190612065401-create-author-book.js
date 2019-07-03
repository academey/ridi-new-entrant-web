"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("author_book", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      author_id: {
        type : Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'author',
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("author_book");
  },
};

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Book.associate = function(models) {
    Book.belongsToMany(models.Author, { through: 'AuthorBook' });
    Book.hasOne(models.BookReservation, { foreignKey: 'bookId' });
  };
  return Book;
};

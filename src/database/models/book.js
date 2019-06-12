'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  book.associate = function(models) {
    book.belongsTo(models.author, {
      foreignKey: 'authorId'
    });
  };
  return book;
};

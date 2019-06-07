'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
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
    // associations can be defined here
  };
  return book;
};

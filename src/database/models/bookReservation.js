'use strict';
module.exports = (sequelize, DataTypes) => {
  const BookReservation = sequelize.define('BookReservation', {
    userId: {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
    bookId: {
      type : DataTypes.INTEGER,
      allowNull: false,
    },
    endAt: {
      type : DataTypes.DATE,
      allowNull: false,
    },
  }, {});
  BookReservation.associate = function(models) {
    // associations can be defined here
  };
  return BookReservation;
};

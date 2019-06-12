'use strict';
export default function (sequelize, DataTypes) {
  const author = sequelize.define('author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  author.associate = function(models) {
    // associations can be defined here
    author.hasMany(models.book)
  };
  return author;
};

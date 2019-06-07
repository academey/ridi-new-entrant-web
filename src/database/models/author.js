'use strict';
module.exports = (sequelize, DataTypes) => {
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
  };
  return author;
};

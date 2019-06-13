'use strict';
export default function (sequelize, DataTypes) {
  const Author = sequelize.define('Author', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Author.associate = function(models) {
    Author.belongsToMany(models.Book, { through: 'AuthorBook' });
  };
  return Author;
};

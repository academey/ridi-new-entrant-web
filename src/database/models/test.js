'use strict';
module.exports = (sequelize, DataTypes) => {
    const Test = sequelize.define('Test', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        engName: DataTypes.STRING
    }, {
    });
    Test.associate = function(models) {
        // associations can be defined here
    };
    return Test;
};

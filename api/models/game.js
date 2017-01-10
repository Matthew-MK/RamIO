// file app/models/user.js
// define the model for Game

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('game', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            score: DataTypes.INTEGER,
            start: {
                type: DataTypes.DATE,
                primaryKey: true
            }
        },
        {
            getterMethods: {
                someValue: function() {
                    return this.someValue;
                }
            },
            setterMethods: {
                someValue: function(value) {
                    this.someValue = value;
                }
            }
        });
};
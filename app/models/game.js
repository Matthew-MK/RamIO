// file app/models/user.js
// define the model for Game

var configDB = require('../../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url);
var User = sequelize.import('./user');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('game', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: User,
                    key: 'id'
                }
            },
            session: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            score: DataTypes.INTEGER,
            start: DataTypes.DATE
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
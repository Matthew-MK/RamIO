// file app/models/user.js
// define the model for GameHistory

var User = sequelize.import('../app/models/user');
var GameHistory = sequelize.import('../app/models/gameHistory');
GameHistory.sync();

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('gameHistory', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: User,
                    key: 'id'
                }
            },
            session: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            highScore: DataTypes.INTEGER,
            gameStart: DataTypes.DATE
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
// file app/models/user.js
// define the model for User


// load the things we need

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            password: DataTypes.STRING
        },
        {
            classMethods: {
                generateHash : function(password) {
                    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                }
            },
            instanceMethods: {
                validPassword : function(password) {
                    return bcrypt.compareSync(password, this.password);
                }
            },
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
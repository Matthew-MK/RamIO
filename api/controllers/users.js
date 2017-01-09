// functions to insert and delete into gameHistory table
// var configDB = require('../../config/database.js');
// var Sequelize = require('sequelize');
// var sequelize = new Sequelize(configDB.url, {
//     // timestamps: false
// });
// var User = sequelize.import('../models/user');
// User.sync();

module.exports = {
    findById: function (id) {
        User.findOne({
            where: {id: id},
            attributes: ['username']
        }).then(function (user) {
            console.log(user.dataValues);
        });
    }
};

// users = require('./users');
// users.findById(1);
//


/*JUNK TEST FILE*/


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

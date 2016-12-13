// functions to insert and delete into gameHistory table
var configDB = require('../../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url);
var Game = sequelize.import('../models/game');
Game.sync();

module.exports = {
    insert: function (game) {
        Game.build(game)
            .save()
            .then(function(game) {
                console.log('inserted', game);
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getLastFive: function(id, callback, user) {
        Game.findAll({
            attributes: ['session', 'score'],
            where: {
                id: id
            },
            limit: 5,
            order: 'session DESC'
        })
            .then(function(scores) {

                results = scores.map(function(s) {
                    return s.dataValues;
                });
                callback('profile.ejs', {
                        user: user,
                        results: results
                    });
                console.log(results);
            })
            .catch(function(e) {
                console.log(e);
            })
    }
};

var games = require('./game');
// // for (var i=2; i < 10; i++) {
// //     games.insert({
// //         id: 1,
// //         session: i,
// //         score: 100,
// //         start: '2016-01-01'
// //     });
// // }
// games.getLastFive(1);
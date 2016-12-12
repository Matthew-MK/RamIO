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
    getLastFive: function(id, callback) {
        Game.findAll({
            attributes: ['session', 'score'],
            where: {
                id: id
            },
            limit: 5,
            order: 'session DESC'
        })
            .then(function(scores) {
                var results = [];
                for (var i=0; i < scores.length; i++) {
                    results.push(scores[i].dataValues);
                }
                callback(results);
            })
            .catch(function(e) {
                console.log(e);
            })
    }
};

var games = require('./game');
// for (var i=2; i < 10; i++) {
//     games.insert({
//         id: 1,
//         session: i,
//         score: 100,
//         start: '2016-01-01'
//     });
// }
console.log(games.getLastFive(1, function(results) {
     return results;
}));
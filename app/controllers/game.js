// functions to insert and delete into gameHistory table
var configDB = require('../../config/database.js');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.url);
var Game = sequelize.import('../models/game');
Game.sync();

module.exports = {
    insert : function (game) {
        Game.build(game)
            .save()
            .then(function(game) {
                console.log('inserted', game);
            })
            .catch(function(e) {
                console.log(e);
            })
    }
};

var games = require('./game');
games.insert({
    id: 1,
    session: 1,
    score: 100,
    start: '2016-01-01'
});
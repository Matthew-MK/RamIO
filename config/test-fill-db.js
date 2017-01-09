// =====================================================
// Tester DB CRUD operations performed here with junk data. Off during
// normal operation.
// =====================================================
// connect to DB and initialize schemas
function testPopulateTables() {
    var configDB = require('./database.js');
    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(configDB.url);

    var User = sequelize.import('../api/models/user');
    var Game = sequelize.import('../api/models/game');
    User.sync({force: true})
        .then(function() {
                insertTestUsers(User, Game);
    })
}

// =============================================================
// Tester methods to test insert operations into Users
// =============================================================

function insertTestUsers(User, Game) {

    var fellowship = [
        'Frodo',
        'Samwise',
        'Gandalf',
        'Legolas',
        'Gimli',
        'Aragorn',
        'Boromir',
        'Meriadoc',
        'Peregrin'
    ];

    for (var i=0; i<fellowship.length; i++) {
        var newUser = User.build ({username: fellowship[i], password: User.generateHash('hobbit')});
        newUser.save().then(function(newUser) {
            console.log(newUser.dataValues.username + '\n');
    })
            .catch(function(err) {
                console.log(err.message);
            });
    }
    Game.sync({force: true})
        .then(function() {
            insertTestGameLogs(User, Game);
    })
}

// ===================================================================
// This tests the retrieval from Users and inserting that into Games
// ===================================================================


function insertTestGameLogs (User, Game) {

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    User.findAll().then(function(users) {
        for (var i=0; i<users.length; i++) {
            var avgGames = Math.ceil(Math.random() * 5);
            var id = users[i].id;
            for (j=0; j<avgGames; j++) {
                var score = Math.floor(Math.random() * 250);
                var start = randomDate(new Date(2016, 10, 9), new Date());
                var newGame = Game.build({id: id, score: score, start: start});
                newGame.save().then(function(newGame) {
                    console.log(newGame.dataValues.id + '\n');
                })
                    .catch(function(err) {
                        console.log(err.message);
                });
            }
        }

    });

}

testPopulateTables();
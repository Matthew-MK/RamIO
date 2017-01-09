// Schema model and functions to insert and delete into games sql table
// =======================================================

module.exports = {
    insert: function (game, Game) {
        Game.build(game)
            .save()
            .then(function(game) {
                console.log('inserted', game);
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getLastFive: function(req, res, Game) {
        Game.findAll({
            attributes: ['start', 'score'],
            where: {
                id: req.user.id
            },
            limit: 5,
            order: 'start DESC'
        })
            .then(function(scores) {

                req.user.history = scores.map(function(s) {
                    return s.dataValues;
                });
                res.render('profile.ejs', {
                    user: req.user
                });
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getHighScore: function(req, res, next, Game) {
        Game.findOne({

            attributes: ['score', 'start'],
            where: {
                id: req.user.id
            },
            order: 'score DESC'
        })
            .then(function(max) {
                req.user.highScore = max ? {score: max.score, start: max.start} : {score: 'None', start: 'Never'};
                next(req, res, Game);
        })
            .catch(function(e) {
                console.log(e);
            })
    }
};


// =============================================================
// Tester methods to assess CRUD operations
// =============================================================

function insertTestGameLogs () {

    var gameLogger = require('./game');

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    User.findAll().then(function(users) {

        users = users.map(function(u) {
            return u.dataValues;
        });

        console.log(users);

        for (i=0; i<users.length; i++) {
            var numScores = Math.ceil(Math.random() * 5);
            var id = users[i].id;
            for (j=0; j<numScores; j++) {
                var score = Math.floor(Math.random() * 1000);
                var start = randomDate(new Date(2016, 7, 13), new Date());
                gameLogger.insert({id: id, start: start, score: score});
            }
        }
    });
}

// Tester activators below here
// =====================================================
// gameLogger = require('./game.js');
// insertTestGameLogs();
// gameLogger.getHighScore();
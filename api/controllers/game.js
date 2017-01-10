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
    getHighScore: function(req, res, next, Game) {
        Game.findOne({

            attributes: ['score', 'start'],
            where: {
                id: req.user.id
            },
            order: 'score DESC'
        })
            .then(function(max) {
                // req.user.highScore = max ? {score: max.score, start: max.start} : {score: 'None', start: 'Never'};
                req.user.highScore = max ? {score: max.score, start: max.start} : {};
                // req.user.highScore = {score: max.score, start: max.start};
                next(req, res, Game);
            })
            .catch(function(e) {
                console.log(e);
            })
    },
    getLastFiveScores: function(req, res, Game) {
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
    getTopFivePlayers: function(req, res, Game, User) {
        Game.findAll({
                attributes: ['id', 'score'],
                limit: 5,
                order: 'score DESC'
            })
            .then(function(topScores) {
                topScores = topScores.map(function(item) {
                    return {id: item.dataValues.id, score: item.dataValues.score};
                });

                // want to try and solve with map, reduce, and/or filter
                // way too tired tonight though
                User.findAll().then(function(users) {
                    // req.topPlayers = [];
                    for (var i=0; i<topScores.length; i++) {
                        for (var j=0; j<users.length; j++) {
                            if (topScores[i].id=== users[j].id) {
                                topScores[i].username = users[j].username;
                            }
                        }
                    }
                    res.render('index.ejs', {
                        topPlayers: topScores
                    });
                })
            }
        )
    }



    // getTopFivePlayers: function(req, res, Game, User) {
    //     Game.findAll({
    //         attributes: ['id', 'score'],
    //         limit: 5,
    //         order: 'score DESC'
    //     })
    //         .then(function(scores) {
    //             req.topfive = scores.map(function(s) {
    //                 return s.dataValues;
    //             });
    //             console.log(req.topfive);
    //             User.findAll({
    //                 attributes: ['id', 'username']
    //             })
    //                 .then(function(u) {
    //                     var allUsers = u.map(function(s) {
    //                         return s.dataValues;
    //                     });
    //                     console.log(allUsers);
    //                     for (var i=0; i < 5; i++) {
    //                         for (var j=0; j < allUsers.length; j++) {
    //                             if (req.topfive[i]['id'] === allUsers[j]['id']) {
    //                                 req.topfive[i]['username'] = allUsers[j]['username'];
    //                             }
    //                         }
    //                     }
    //                     console.log(req.topfive);
    //                     res.render('index.ejs', {
    //                         topfive: req.topfive
    //                     })
    //                 })
    //                 .catch(function(e) {
    //                     console.log(e);
    //                 })
    //             })
    //         .catch(function(e) {
    //             console.log(e);
    //         })
    // }
};

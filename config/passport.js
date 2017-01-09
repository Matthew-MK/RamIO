// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
// var pg = require('pg').native;
// var pghstore = require('pg-hstore');
// var configDB = require('./database.js');
// var Sequelize = require('sequelize');
// var sequelize = new Sequelize(configDB.url);

// var gameLogger = require('../api/controllers/game');
// var Game = sequelize.import('../api/models/game');
// Game.sync();
// var User = sequelize.import('../api/models/user');
// User.sync();

// expose this function to our api using module.exports
module.exports = function(passport, User) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user){
            done(null, user);
        }).catch(function(e){
            done(e, false);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.

            User.findOne({ where: { username: username }})
                .then(function(existingUser) {

                    // check to see if there's already a user with that email
                    if (existingUser)
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));

                    //  If we're logged in, we're connecting a new local account.
                    if(req.user) {
                        var user = req.user;
                        user.username = username;
                        user.password = User.generateHash(password);
                        user.save().catch(function (err) {
                            throw err;
                        }).then (function() {
                            // console.log(user.get({plain: true}));
                            done(null, user);
                        });
                    }
                    //  We're not logged in, so we're creating a brand new user.
                    else {
                        // create the user
                        var newUser = User.build ({username: username, password: User.generateHash(password)});
                        newUser.save().then(function() {
                            done (null, newUser);
                        })
                            .catch(function(err) {
                                done(null, false, req.flash('signupMessage', err.message));
                            });
                    }
                })
                .catch(function (e) {
                    done(null, false, req.flash('signupMessage', e.message));
                })

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, username, password, done) {
            User.findOne({ where: { username: username }})
                .then(function(user) {
                    if (!user) {
                        done(null, false, req.flash('loginMessage', 'Unknown user'));
                    } else if (!user.validPassword(password)) {
                        done(null, false, req.flash('loginMessage', 'Wrong password'));
                    } else {
                        done(null, user);
                    }
                })
                .catch(function(e) {
                    done(null, false, req.flash('loginMessage', e.name, e.message));
                });
        }));


};

// var gameLogger = require('./app/controllers/gameLogger');

module.exports = function(io, user, app) {
    io.on('connection', function(socket){
        console.log('a user connected');
        // Take id from authentication ID
        var id = user.id;
        var username = user.username;
        // x,y coordinates
        var coords = [Math.floor(Math.random()*Game.width), Math.floor(Math.random()*Game.height)];
        var color = randomColor(150);
        Game.entities[id] = [coords[0],coords[1],10, color, username];
        // Send an id and coordinates for the player to spawn at
        socket.emit('PlayerSetup', { id: id, username: username, coords: coords, color: color, entities: Game.entities, grass: Game.grass, missiles: Game.missiles });
        /* debugging player connection
         socket.on('setup', function (id,x,y,color) {
         console.log(id + " setup at " + x + "," + y + " with color " + color);
         });
         */

        socket.on('PlayerUpdate', function(data){
            socket.broadcast.emit('PlayerUpdate', data);
            Game.entities[data.id] = [data.x, data.y, data.size, data.color, data.angle, data.username];
        });
        // player is attempting to eat a piece of grass
        socket.on('EatRequest', function(data){
            if (Game.grass[data.id].x == data.x && Game.grass[data.id].y == data.y) {
                // tell client they succesfully ate grass
                socket.emit('EatGrass');
                Game.grass[data.id] = false;
                // If grass has been eaten in a verified manner, replace that piece of grass with another. Send to ALL
                var replacementgrass = generateGrass();
                io.emit('GrassUpdate', {id: data.id, x: replacementgrass.x, y: replacementgrass.y});
            }
        });
        // player is attempting to pick up a missile (in the gameLogger.js main gameLogger loop, not in the clientCSinteractions.js)
        // TODO make sure the change from copied 'EatRequest' to 'PickupRequest' below works as intended
        // TODO make sure the 'PickupMissle' and 'MissileUpdate' given to socket.emit and io.emit respectively work as intended
        socket.on('PickupRequest', function(data){
            if (Game.missiles[data.id].x == data.x && Game.missiles[data.id].y == data.y) {
                // tell client they succesfully picked up a missile
                socket.emit('PickupMissile');
                Game.missiles[data.id] = false;
                // If missile has been picked up in a verified manner, replace that missile with another. Send to ALL
                var replacementMissile = generateMissile();
                io.emit('MissilesUpdate', {id: data.id, x: replacementMissile.x, y: replacementMissile.y});
            }
        });
        socket.on('MissileEvent', function (data) {
            socket.broadcast.emit('MissileEvent', data);
        });
        socket.on('MissileHit', function (data) {
            socket.broadcast.emit('MissileHit', data);
        });
        socket.on('Die', function (data) {
            io.emit('Die', data);
        });
        socket.on('RequestRespawn', function () {
            // Take id from authentication ID
            var id = user.id;
            var username = user.username;
            // x,y coordinates
            var coords = [Math.floor(Math.random()*Game.width), Math.floor(Math.random()*Game.height)];
            var color = randomColor(150);
            Game.entities[id] = [coords[0],coords[1],10, color, username];
            // Send an id and coordinates for the player to spawn at
            socket.emit('PlayerSetup', { id: id, username: username, coords: coords, color: color, entities: Game.entities, grass: Game.grass, missiles: Game.missiles });
        });
        socket.on('disconnect', function(){
            console.log('user disconnected');
            //TODO write code to log final death of disconnected client if possible
        });
    });


//Server-side gameLogger logic
    var Game = {};

// fps denotes times gameLogger will be updated per second and sent out to players
    Game.fps = 30;
    Game.width = 2500;
    Game.height = 2500;
    Game.numGrass = 200;
    Game.numMissiles = 50;

    Game.initialize = function() {
        Game.entities = [];
        Game.grass = [];
        Game.missiles = [];
        var i;
        for (i = 0; i < Game.numGrass; i++) {
            Game.grass.push(generateGrass());
        }
        var j;
        for (j = 0; j < Game.numMissiles; j++) {
            Game.missiles.push(generateMissile());
        }
        //TODO add conditions for ending the gameLogger
        this.gamestart = (new Date).getTime;
    };
    var startrunning = true;
    Game.run = function() {
        // console.log('running gameLogger loop');
        var loops = 0, skipTicks = 1000 / Game.fps,
            maxFrameSkip = 10;
        if (startrunning) {
            nextGameTick = (new Date).getTime();
            startrunning = false;
        }

        while ((new Date).getTime() > nextGameTick) {
            // console.log('emitted gameLogger update');
            nextGameTick += skipTicks;
            loops++;
        }
    };

// Start the gameLogger loop
    Game.initialize();
    setInterval(Game.run, 1000/Game.fps);

    function randomColor(brightness){
        function randomChannel(brightness){
            var r = 255-brightness;
            var n = 0|((Math.random() * r) + brightness);
            var s = n.toString(16);
            return (s.length==1) ? '0'+s : s;
        }
        return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
    }

    function generateGrass () {
        var coords = {};
        coords.x = Math.floor(Math.random()*Game.width);
        coords.y = Math.floor(Math.random()*Game.height);
        return coords;
    }

    function generateMissile () {
        var coordinates = {};
        coordinates.x = Math.floor(Math.random()*Game.width);
        coordinates.y = Math.floor(Math.random()*Game.height);
        return coordinates;
    }

};


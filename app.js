var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'));
var port = 3001;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    // Assign id between 1 and 1000
    var id = Math.floor(Math.random()*1000 + 1);
    // x,y coordinates
    var coords = [Math.floor(Math.random()*1000), Math.floor(Math.random()*1000)];
    var color = randomColor(150);
    // Send an id and coordinates for the player to spawn at
    socket.emit('PlayerSetup', id, coords, color);
    Game.entities[id] = [coords[0],coords[1],10, color];
    /* debugging player connection
    socket.on('setup', function (id,x,y,color) {
        console.log(id + " setup at " + x + "," + y + " with color " + color);
    });
    */

    socket.on('playerUpdate', function(id,x,y,size, color){
        Game.entities[id] = [x,y,size, color]
    });
    // player is attempting to eat a piece of grass
    socket.on('grassUpdate', function(id){
        if (Game.grass[id]) {
            // tell client they succesfully ate grass
            socket.emit('grow');
            Game.grass[id] = false;
        }
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
        //TODO write code to log final death of disconnected client if possible
    });
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});

//Server-side game logic
var Game = {};

// fps denotes times game will be updated per second and sent out to players
Game.fps = 30;
Game.width = 1000;
Game.height = 1000;

Game.initialize = function() {
    this.entities = [];
    this.grass = [];
    //TODO add conditions for ending the game
    this.gamestart = (new Date).getTime;
};

Game.run = (function() {
    console.log('running game loop');
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 10,
        nextGameTick = (new Date).getTime();

    return function() {
        loops = 0;

        while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
            io.emit('GameUpdate', this.entities,this.grass);
            nextGameTick += skipTicks;
            loops++;
        }
    };
})();

// Start the game loop
Game.initialize();
Game._intervalId = setInterval(Game.run, 1);

function randomColor(brightness){
    function randomChannel(brightness){
        var r = 255-brightness;
        var n = 0|((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length==1) ? '0'+s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}


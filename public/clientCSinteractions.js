// setup my socket client
var socket = io();


socket.on('PlayerSetup', function (data) {
    Game.initialize();
    Player.initialize(data.id, data.coords, data.color, data.username);
    Game.entities = data.entities;
    Game.grass = data.grass;
    Game.missiles = data.missiles;
    // Start the game loop

    setInterval(Game.run, 1000/Game.fps);
    // debugging player connection
    // socket.emit('setup', Player.id, Player.x, Player.y, Player.color);
});

socket.on('PlayerUpdate', function(data){
    Game.entities[data.id] = [data.x, data.y, data.size, data.color, data.radius, data.username];
});

//TODO make growth more dynamic, not just by one
socket.on('EatGrass', function () {
    Player.size +=GRASS_SIZE;
    Player.radius = getRadius(Player.size);
});

//TODO: figure out why this isnt working perfectly.
socket.on('GrassUpdate', function (data) {
    console.log('recieved GRASSSSSSS');
    Game.grass[data.id] = {x: data.x, y: data.y};
});

// TODO make sure just adding a missile to the counter is the only functionality needed here
socket.on('PickupMissile', function () {
    Player.missilesCount += 1;
});

socket.on('MissileEvent', function (data) {
    Game.firedMissiles.push(data);
})

socket.on('MissileHit', function (data) {
    if (data.playerid == Player.id) {
        Player.size += HIT_POINTS;
    }
    Game.firedMissiles[data.id] = null;
});

socket.on('Die', function (data) {
    Game.entities[data.id] = null;
    if (data.playerid == Player.id) {
        // you were responsible for the death
        Player.size += KILL_POINTS;
    }
})
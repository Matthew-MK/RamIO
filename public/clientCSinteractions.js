// setup my socket client
var socket = io();


socket.on('PlayerSetup', function (id, coords, color) {
    Player.id = id;
    Player.x = coords[0];
    Player.y = coords[1];
    Player.color = color;
    drawMap(Player.entities, Player.grass);
    // debugging player connection
    // socket.emit('setup', Player.id, Player.x, Player.y, Player.color);
});

socket.on('GameUpdate', function (entities, grass) {
    Game.entities = entities;
    Game.grass = grass;
});

//TODO make growth more dynamic, not just by one
socket.on('grow', function () {
    Player.size +=1;
});
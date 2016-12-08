// setup my socket client
var socket = io();


socket.on('PlayerSetup', function (id, coords, color) {
    Player.id = id;
    Player.x = coords[0];
    Player.y = coords[1];
    Player.color = color;
    // debugging player connection
    // socket.emit('setup', Player.id, Player.x, Player.y, Player.color);
});

socket.on('GameUpdate', function (entities, grass) {
    drawMinimap(entities);
    drawMap(entities, grass);
});

//TODO make growth more dynamic, not just by one
socket.on('grow', function () {
    Player.size +=1;
});
// setup my socket client
(function () {
	var socket = io();
})();

socket.on('PlayerSetup', function (id, coords) {
    Player.id = id;
    Player.x = coords[0];
    Player.y = coords[1];
});

socket.on('GameUpdate', function (entities, grass) {
    drawMinimap(entities);
    drawMap(entities, grass);
});

//TODO make growth more dynamic, not just by one
socket.on('grow', function () {
    Player.size +=1;
});
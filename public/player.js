/**
 * Created by Chris Brajer on 12/7/2016.
 */
var Player = {};

Player.size = 10;
Player.speed = 1;

Player.initialize = function(id, position, color) {
    this.id = id;
    this.x = position[0];
    this.y = position[1];
    this.color = color;
};

var bodyElement = document.getElementById("main");
bodyElement.addEventListener("mousemove", function (e) {moveRam(event)}, false);

var moveRam = function (e) {
    Player.mouseX = e.clientX;
    Player.mouseY = e.clientY;
};

function updateCoordinates() {
    Player.angle = Math.atan(Math.abs((Player.mouseY-Player.y) / (Player.mouseX-Player.x)));
    Player.x = Player.speed * Math.cos(Player.angle);
    Player.y = Player.speed * Math.sin(Player.angle);
};

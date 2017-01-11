/**
 * Created by Chris Brajer on 12/7/2016.
 */
var Player = {};
MOUSEFREQ = 50;
RADIUS_FACTOR = .80;

Player.size = 50;
Player.speed = 4;
Player.radius = getRadius(Player.size);
Player.missilesCount = 0;
Player.angle = 0;
Player.deaths = [];
img = new Image();
img.src = "/resources/playerRamio.svg";

enemyRam = new Image();
enemyRam.src = "/resources/enemyRam.svg";

Player.initialize = function(id, position, color, username, start) {
    this.start = start;
    this.id = id;
    this.x = position[0];
    this.y = position[1];
    this.color = color;
    this.mouseX = 800;
    this.mouseY = 450;
    this.username = username;
    this.maxSize = Player.size;
};

//Listening for mouse position changes
window.addEventListener('mousemove', mouseHandler, false);

// listens for clicks to fire missile
window.addEventListener('click', clickHandler, false);
// TODO functionality for firing missiles done here or somewhere else?
function clickHandler(e){
    if(Player.missilesCount > 0){
        var id = Math.random()*10000;
        var firedMissile = {id: id, playerid: Player.id, x: Player.x, y: Player.y, angle: Player.angle};
        Game.firedMissiles.push(firedMissile);
        socket.emit('MissileEvent', firedMissile);
        Player.missilesCount--;
    } else {
        // do nothing
    }
}

function mouseHandler(e) {
    getMousePos(c, e)
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

    Player.mouseX = (evt.clientX - rect.left) * scaleX;  // scale mouse coordinates after they have
    Player.mouseY = (evt.clientY - rect.top) * scaleY;   // been adjusted to be relative to element
}

function updateCoordinates() {
    //TODO do we need to make sure that player has been initialized? if(Player.id) {}
    Player.angle = Math.atan2( Player.mouseY-c.height/2, Player.mouseX-c.width/2 )/**(180/Math.PI)*/;
    if (Player.x > Game.width) {
        Player.x -= 5;
    }
    if (Player.y > Game.height) {
        Player.y -= 5;
    }
    if (Player.x < 0) {
        Player.x += 5;
    }
    if (Player.y < 0) {
        Player.y += 5;
    }
    Player.x += Player.speed * Math.cos(Player.angle);
    Player.y += Player.speed * Math.sin(Player.angle);
    Game.entities[Player.id] = [Player.x, Player.y, Player.size, Player.color,Player.radius, Player.username];
}

//TODO: How do we want to scale radius?
function getRadius(size) {
    //return Math.sqrt(size);
    return Math.pow(size, RADIUS_FACTOR)
}
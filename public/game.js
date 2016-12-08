/**
 * Created by Chris Brajer on 12/7/2016.
 */
//Client-side game logic
var Game = {};
// buffer for rendering large players
var buffer = 50;

// fps denotes times game will be updated per second and sent out to server
Game.fps = 30;
Game.width = 1000;
Game.height = 1000;

Game.initialize = function() {
    this.entities = [];
    this.grass = [];
    //TODO add visuals for ending the game
};

Game.run = (function() {
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 10,
        nextGameTick = (new Date).getTime();

    return function() {
        loops = 0;

        while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
            Player.updateCoordinates();
            io.emit('PlayerUpdate', Player.id, Player.x, Player.y, Player.size, Player.color);
            nextGameTick += skipTicks;
            loops++;
        }
    };
})();

// Start the game loop
Game.initialize();
Game._intervalId = setInterval(Game.run, 0);

/*--------- Minimap drawing functionality --------*/
var drawMinimap = function(players) {
    var minimap = document.getElementById("minimap");
    mini_ctx = minimap.getContext("2d");

    var scaleX = minimap.width / Game.width;
    var scaleY = minimap.height / Game.height;
    players.forEach(function(player){
        if (Player.id != player.id) {
            //TODO make sure that log2 is the correct size
            drawMinimapCircle(log2(player.size),player.x * scaleX,player.y * scaleY,player.color);
        }
    });
};

function drawMinimapCircle(size, xPos, yPos, color) {
    mini_ctx.beginPath();
    mini_ctx.arc(xPos, yPos, size, 0, 2 * Math.PI);
    mini_ctx.fillStyle = color;
    mini_ctx.fill();
}
/*------------------------------------------------*/

/*----------- Map drawing functionality ----------*/
var drawMap = function(players,grass) {
    var c = document.getElementById("main");
    ctx = c.getContext("2d");

    var Width = c.width;
    var Height = c.height;
    //TODO have spacing be controlled based on the size of the player
    var GridSize = 80;

    var i;
    for (i = Player.y % 80; i < Height; i += GridSize) {
        ctx.lineWidth = 1;
        ctx.moveTo(0, i);
        ctx.lineTo(Width, i);
        ctx.stroke();
    }
    for (i = Player.x % 80; i < Width; i += GridSize) {
        ctx.lineWidth = 1;
        ctx.moveTo(i, 0);
        ctx.lineTo(i, Height);
        ctx.stroke();
    }

    players.forEach(function(player){
        if (Player.id != player.id) {
            //TODO make sure that log2 is the correct size
            var offsetX = player.x - Player.x;
            var offsetY = player.y - Player.y;
            if (Math.abs(offsetX) < Width/2 + buffer && Math.abs(offsetY) < Height/2 + buffer) {
                drawCircle(log2(player.size), Width + offsetX, Height + offsetY, player.color);
            }
        }
    });
    //TODO always keep the player in the center of the screen?
    drawCircle(Player.size, Width/2, Height/2, Player.color);

    grass.forEach(function(patch){
        var offsetX = patch.x - Player.x;
        var offsetY = patch.y - Player.y;
        if (Math.abs(offsetX) < Width/2 + buffer && Math.abs(offsetY) < Height/2 + buffer) {
            //TODO make grass dynamic
            drawCircle(3, Width/2 + offsetX, Height/2 + offsetY, 'green');
        }
    });
};

function drawCircle(size, xPos, yPos, color) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}
/*-------------------------------------------------*/

function log2(val) {
    return Math.log(val) / Math.LN2;
}


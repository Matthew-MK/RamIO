/**
 * Created by Chris Brajer on 12/7/2016.
 */
//Client-side game logic
var Game = {};
var leaderboard = [];
var MISSILE_SIZE = 10;
var MISSILE_SPEED = 10;
var KILL_POINTS = 100;
var HIT_POINTS = 10;
var HIT_REDUCTION = 20;

// curently static grass patch size
var GRASS_SIZE = 10;
var SVG_MULTIPLIER = 1.6;

// fps denotes times game will be updated per second and sent out to server
Game.fps = 45;
Game.width = 2500;
Game.height = 2500;

Game.initialize = function() {
    this.entities = [];
    this.grass = [];
    this.missiles = [];
    this.firedMissiles = [];
    //TODO add visuals for ending the game

    minimap = document.getElementById("minimap");
    mini_ctx = minimap.getContext("2d");

    c = document.getElementById("main");
    ctx = c.getContext("2d");
};

var startrunning = true;
Game.run = function() {
    // console.log('running game loop');
    var loops = 0, skipTicks = 1000 / Game.fps,
        maxFrameSkip = 2;
    if (startrunning) {
        nextGameTick = (new Date).getTime();
        startrunning = false;
    }

    while ((new Date).getTime() > nextGameTick && loops < maxFrameSkip) {
        updateCoordinates();
        updateMissiles();
        updateLeaderboard();
        //TODO: implement angle in PlayerUpdate
        socket.emit('PlayerUpdate', { id: Player.id, username: Player.username, x: Player.x, y: Player.y, size: Player.size, color: Player.color, angle: Player.angle });
        // Track player max size for post-death screen
        Player.maxSize = Math.max(Player.size, Player.maxSize);
        // console.log ( 'sent player location to server' );
        nextGameTick += skipTicks;
        loops++;
    }
    // draw as often as possible, only send updates fps a second
    // console.log ( 'drawing to canvas' );
    drawMinimap(Game.entities);
    drawMap(Game.entities, Game.grass, Game.missiles);
};

/*--------- Minimap drawing functionality --------*/
function drawMinimap(players) {

    // get a clean slate
    mini_ctx.clearRect(0, 0, minimap.width, minimap.height);
    var scaleX = minimap.width / Game.width;
    var scaleY = minimap.height / Game.height;
    for (var key in players) {
        if (players[key] != null && Player.id != key) {
            drawMinimapCircle(getRadius(players[key][2]) * scaleX,players[key][0] * scaleX,players[key][1] * scaleY,'red');
        }
        else if (Player.id == key) {
            drawMinimapCircle(getRadius(players[key][2]) * scaleX,players[key][0] * scaleX,players[key][1] * scaleY,'green');
        }
    }
}

function drawMinimapCircle(size, xPos, yPos, color) {
    mini_ctx.beginPath();
    mini_ctx.arc(xPos, yPos, size, 0, 2 * Math.PI);
    mini_ctx.fillStyle = color;
    mini_ctx.fill();
}
/*------------------------------------------------*/

/*----------- Map drawing functionality ----------*/
function drawMap(players,grass, missiles) {
    var Width = c.width;
    var Height = c.height;
    //TODO have spacing be controlled based on the size of the player
    var GridSize = 80;

    // get a clean slate
    ctx.clearRect(0, 0, c.width, c.height);
    var i;
    for (i = -(Player.y % GridSize); i < Height; i += GridSize) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(0, i);
        ctx.lineTo(Width, i);
        ctx.stroke();
        ctx.closePath();
    }
    for (i = -(Player.x % GridSize); i < Width; i += GridSize) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(i, 0);
        ctx.lineTo(i, Height);
        ctx.stroke();
        ctx.closePath();
    }

    for (var key in players) {
        if (Player.id != key && players[key] != null) {
            //TODO implement enemy ram
            var offsetX = players[key][0] - Player.x;
            var offsetY = players[key][1] - Player.y;
            var radius = getRadius(players[key][2]);
            if (Math.abs(offsetX) < Width/2 + radius && Math.abs(offsetY) < Height/2 + radius) {
                drawCircle(radius, Width/2 + offsetX, Height/2 + offsetY, players[key][3]);
                //TODO Make this a function?
                // rotateAndPaintImage(ctx, img, Player.angle, Width/2 - Player.radius/2, Height/2 - Player.radius/2, Player.radius, Player.radius );
                // ctx.translate(Width/2 + offsetX, Height/2 + offsetY);
                // ctx.rotate(players[key][4] - Math.PI/2);
                // ctx.drawImage(enemyRam,-radius,-Player.radius,2*players[key][3],2*players[key][3]);
                // ctx.rotate(-players[key][4] + Math.PI/2);
                // ctx.translate(-Width/2 - offsetX, -Height/2 - offsetY);

            }
        }
    }
    // Render FIRED missiles
    for (var i = 0; i < Game.firedMissiles.length; i++) {
        if (Game.firedMissiles[i] != null) {
            var offsetX = Game.firedMissiles[i].x - Player.x;
            var offsetY = Game.firedMissiles[i].y - Player.y;
            if (Math.abs(offsetX) < Width/2 + MISSILE_SIZE && Math.abs(offsetY) < Height/2 + MISSILE_SIZE) {
                if (Game.firedMissiles[i].playerid != Player.id && Math.abs(offsetX) < Player.radius + MISSILE_SIZE && Math.abs(offsetY) < Player.radius + MISSILE_SIZE) {
                    //TODO: Make damage dynamic
                    Player.size -= HIT_REDUCTION;
                    Game.firedMissiles[i] = null;
                    socket.emit('MissileHit', Game.firedMissiles[i]);
                    if(Player.size <= 0) {
                        processDeath(Game.firedMissiles[i]);
                    }
                }
                drawCircle(MISSILE_SIZE, Width/2 + offsetX, Height/2 + offsetY, 'red');
                //TODO Make this a function?
                // rotateAndPaintImage(ctx, img, Player.angle, Width/2 - Player.radius/2, Height/2 - Player.radius/2, Player.radius, Player.radius );
                // ctx.translate(Width/2 + offsetX, Height/2 + offsetY);
                // ctx.rotate(players[key][4] - Math.PI/2);
                // ctx.drawImage(enemyRam,-radius,-Player.radius,2*players[key][3],2*players[key][3]);
                // ctx.rotate(-players[key][4] + Math.PI/2);
                // ctx.translate(-Width/2 - offsetX, -Height/2 - offsetY);

            }
        }
    }
    //TODO Make this a function?
    // rotateAndPaintImage(ctx, img, Player.angle, Width/2 - Player.radius/2, Height/2 - Player.radius/2, Player.radius, Player.radius );
    ctx.translate(Width/2, Height/2);
    ctx.rotate(Player.angle - Math.PI/2);
    ctx.drawImage(img,-Player.radius,-Player.radius,2*Player.radius,2*Player.radius);
    ctx.rotate(-Player.angle + Math.PI/2);
    ctx.translate(-Width/2, -Height/2);
    // drawCircle(Player.radius, Width/2, Height/2, Player.color);

    for (i = 0; i < grass.length; i++) {
        if (grass[i] != null) {
            var offsetX = grass[i].x - Player.x;
            var offsetY = grass[i].y - Player.y;
            if (Math.abs(offsetX) < Width / 2 + GRASS_SIZE && Math.abs(offsetY) < Height / 2 + GRASS_SIZE) {
                if (Math.abs(offsetX) < Player.radius + GRASS_SIZE && Math.abs(offsetY) < Player.radius + GRASS_SIZE) {
                    socket.emit('EatRequest', {id: i, x: grass[i].x, y: grass[i].y});
                    grass[i] = null;
                }
                else {
                    drawCircle(GRASS_SIZE, Width / 2 + offsetX, Height / 2 + offsetY, 'green');
                }
            }
        }
    }
    // when a player gets close enough, pick up the missile
    var j;
    for (j = 0; j < missiles.length; j++) {
        if (missiles[j] != null) {
            var offsetX = missiles[j].x - Player.x;
            var offsetY = missiles[j].y - Player.y;
            if (Math.abs(offsetX) < Width / 2 + MISSILE_SIZE && Math.abs(offsetY) < Height / 2 + MISSILE_SIZE) {
                if (Math.abs(offsetX) < Player.radius + MISSILE_SIZE && Math.abs(offsetY) < Player.radius + MISSILE_SIZE) {
                    socket.emit('PickupRequest', {id: j, x: missiles[j].x, y: missiles[j].y});
                    missiles[j] = null;
                }
                else {
                    drawCircle(MISSILE_SIZE, Width / 2 + offsetX, Height / 2 + offsetY, 'blue');
                }
            }
        }
    }
}

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

function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
    context.translate( positionX, positionY );
    context.rotate( angleInRad );
    context.drawImage( image, -axisX, -axisY );
    context.rotate( -angleInRad );
    context.translate( -positionX, -positionY );
}

function addLeaderboard (user) {
    for (var i=0; i <= leaderboard.length; i++) {
        if (i == 10) {return}
        if (leaderboard.length == 0) {
            leaderboard.push({username: user[5], size: user[2]});
            return
        }
        if (i == leaderboard.length) {
            leaderboard.push({username: user[5], size: user[2]});
        }
        if (leaderboard[i].username == user[5]) {
            leaderboard[i] = {username: user[5], size: user[2]};
            return
        }
    }
}

function sortLeaderboard () {
    leaderboard.sort(function(a, b){return b.size-a.size});
}

function updateLeaderboard() {
    for (var key in Game.entities) {
        if (Game.entities[key] != null) {
            addLeaderboard(Game.entities[key]);
        }
    }
    sortLeaderboard(Game.entities);
}

window.setInterval(function(){
    $("#scores ol").empty();
    for (var i = 0; i < leaderboard.length; i++) {
        $("#scores ol").append('<li>' + leaderboard[i].username + ': ' + leaderboard[i].size + '</li>');
    }
}, 1000);

function updateMissiles() {
    if (Game.firedMissiles.length == 0) {
        return
    }
    for (var i = 0; i < Game.firedMissiles.length; i++) {
        if (Game.firedMissiles[i] != null) {
            if (Game.firedMissiles[i].x > Game.width || Game.firedMissiles[i].y > Game.height) {
                Game.firedMissiles[i] = null;
            }
            Game.firedMissiles[i].x += MISSILE_SPEED * Math.cos(Game.firedMissiles[i].angle);
            Game.firedMissiles[i].y += MISSILE_SPEED * Math.sin(Game.firedMissiles[i].angle);
        }
    }
}

//TODO: All current reasons are just missiles
function processDeath(reason) {
    //TODO: trigger post-death screen
    //reason.playerid is playerid of player who killed me
    var death = {id: Player.id, reason: reason.playerid};
    socket.emit('Die', death);
    //set speed to 0 on death
    Player.speed = 0;
    Player.deaths.push(Player.maxSize);

}


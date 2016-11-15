var main = function() {
    c = document.getElementById("main");
    ctx = c.getContext("2d");

    var Width = c.width;
    var Height = c.height;
    var GridSize = 20;

    var i;
    for (i = 0; i < Height; i += GridSize) {
        ctx.lineWidth = 2;
        ctx.moveTo(0, i);
        ctx.lineTo(Width, i);
        ctx.stroke();
    }
    for (i = 0; i < Width; i += GridSize) {
        ctx.lineWidth = 1;
        ctx.moveTo(i, 0);
        ctx.lineTo(i, Height);
        ctx.stroke();
    }

    drawCircle(15, Width/2, Height/2, "red");
}

function drawCircle(size, xPos, yPos, color) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

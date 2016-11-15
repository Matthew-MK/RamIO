var minimap = function() {
    c = document.getElementById("minimap");
    ctx = c.getContext("2d");

    var maxSize = 10;
    var minSize = 5;
    var maxNum = 30;
    var maxX = c.width;
    var maxY = c.height;

    function randoms() {
        var size = Math.ceil(Math.random() * maxSize);
        size = Math.max(size, minSize);
        var number = Math.floor(Math.random * maxNum);
        var x = Math.floor(Math.random() * maxX);
        var y = Math.floor(Math.random() * maxY);
        var colour = '#' + Math.random().toString(16).substr(2, 6);
        return {size: size, number: number, x: x, y: y, colour: colour};
    }

    for (var i = 0; i < 30; i++) {
        var r = randoms();
        drawCircle(r.size, r.x, r.y, r.colour);
    }
};

function drawCircle(size, xPos, yPos, color) {
    ctx.beginPath();
    ctx.arc(xPos, yPos, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

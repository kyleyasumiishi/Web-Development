function cool() {
    var test = document.createElement("img");
    test.src = "images/asteroid_blue.png";
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");
    ctx.drawImage(test, 0, 0);
}



/* 2048 GUI */

// Tile Images
const IMAGE = "../images/assets_2048.png";
const TILE_SIZE = 100;
const HALF_TILE_SIZE = TILE_SIZE / 2;
const BORDER_SIZE = 45;

// Directions
const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

// Prevent Directions and Offsets from changing
Object.freeze(UP);
Object.freeze(DOWN);
Object.freeze(LEFT);
Object.freeze(RIGHT);
Object.freeze(TILE_SIZE);
Object.freeze(HALF_TILE_SIZE);
Object.freeze(BORDER_SIZE);
Object.freeze(IMAGE);

function load_canvas() {
    setInterval(function() {draw()}, 10);
}

// class GUI {
//     constructor(game) {
//         this._rows = game.get_grid_height();
//         this._cols = game.get_grid_width();
//         this._game = game;
//     } 

//     keydown
// }



function draw() {
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");

    // Set canvas background color
    ctx.fillStyle = "#BCADA1";
    ctx.fillRect(0, 0, 490, 490);
}




module.exports = { load_canvas: load_canvas, draw: draw };
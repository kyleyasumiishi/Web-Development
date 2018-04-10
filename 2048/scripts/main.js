/* Clone of 2048 game. */

var score = 0;

// Directions
const UP = 1;
const DOWN = 2;
const LEFT = 3;
const RIGHT = 4;

// Offsets for computing tile indices in each direction
const OFFSETS = 
{
    UP: [1, 0],
    DOWN: [-1, 0], 
    LEFT: [0, 1],
    RIGHT: [0, -1]
}

// Tile Images
const IMAGE = "../images/assets_2048.png";
const TILE_SIZE = 100;
const HALF_TILE_SIZE = TILE_SIZE / 2;
const BORDER_SIZE = 5;

// Prevent Directions and Offsets from changing
Object.freeze(UP);
Object.freeze(DOWN);
Object.freeze(LEFT);
Object.freeze(RIGHT);
Object.freeze(OFFSETS);

/* 
 * Helper function that merges a single row or column.
 * @param {Array} line - A single row or column.
 */
function merge(line) {
    var merged_array = line.filter(num => num != 0);
    // Merge non-zeroes.
    for (let i=1; i<merged_array.length; i++) {
        if (merged_array[i] == merged_array[i - 1]) {
            score = score + (merged_array[i - 1] * 2);
            merged_array[i - 1] *= 2;
            merged_array[i] = 0;
        }
    }
    merged_array = merged_array.filter(num => num != 0);
    // Add trailing zeroes.
    while (line.length > merged_array.length) {
        merged_array.push(0);
    }
    return merged_array;
}

/*
 * Class to run the game logic.
 * @param {number} grid_height - The number of rows.
 * @param {number} grid_width - The number of columns.
 */
class TwentyFortyEight {
    constructor(grid_height, grid_width, grid) {
        this._height = grid_height;
        this._width = grid_width;
        // Create grid.
        if (grid != undefined) {
            this._grid = grid;
        } else {
            this._grid = [];
            for (let r = 0; r < this._height; r++) {
                var row = [];
                for (let c = 0; c < this._width; c++) {
                    row.push(0);
                } 
                this._grid.push(row);
            }
            // Reset game.
            this.reset();
        }
        // Initial tiles.
        this._initial_up = [];
        this._initial_down = [];
        this._initial_left = [];
        this._initial_right = [];
        for (let r = 0; r < this._height; r++) {
            this._initial_left.push([r, 0]);
            this._initial_right.push([r, this._width - 1]);
        }
        for (let c = 0; c < this._width; c++) {
            this._initial_up.push([0, c]);
            this._initial_down.push([this._height - 1, c]);
        }
        this._initial_tiles = {
            1: this._initial_up,
            2: this._initial_down,
            3: this._initial_left,
            4: this._initial_right
        };
    }

    get_grid_height() {
        return this._height;
    }

    get_grid_width() {
        return this._width;
    }

    reset() {
        for (let r = 0; r < this._height; r++) {
            for (let c = 0; c < this._width; c++) {
                this._grid[r][c] = 0;
            }
        }
        this.new_tile();
        this.new_tile();
    }

    get_empty_tiles() {
        var empty_square_array = [];
        for (let r = 0; r < this._height; r++) {
            for (let c = 0; c < this._width; c++) {
                if (this._grid[r][c] == 0) {
                    empty_square_array.push([r, c]);
                }
            }
        }
        return empty_square_array;
    }

    set_tile(row, col, value) {
        this._grid[row][col] = value;
    }

    new_tile() {
        var empty_squares = this.get_empty_tiles();
        var value;
        if (Math.floor(Math.random() * 10) == 9) {
            value = 4;
        } else {
            value = 2;
        }
        if (empty_squares.length > 0) {
            var random_square = empty_squares[Math.floor(Math.random() * empty_squares.length)];
            this.set_tile(random_square[0], random_square[1], value);
        }
    }

    get_tile(row, col) {
        return this._grid[row][col];
    }

    move(dirval) {
        var is_grid_changed = false;
        var traversal_dir;
        var dirval_str;
        if (dirval == 1 || dirval == 2) {
            traversal_dir = this.get_grid_height();
        } else {
            traversal_dir = this.get_grid_width();
        }
        if (dirval == 1) {
            dirval_str = "UP";
        } else if (dirval == 2) {
            dirval_str = "DOWN";
        } else if (dirval == 3) {
            dirval_str = "LEFT";
        } else if (dirval == 4) {
            dirval_str = "RIGHT";
        }
        // Iterate over initial tiles.
        for (let tile = 0; tile < this._initial_tiles[dirval].length; tile++) {
            var temp_array = [];
            var start_row = this._initial_tiles[dirval][tile][0];
            var start_col = this._initial_tiles[dirval][tile][1];
            // Iterate over tiles in traversal_dir.
            for (let tile = 0; tile < traversal_dir; tile++) {
                let row = start_row + (tile * OFFSETS[dirval_str][0]);
                let col = start_col + (tile * OFFSETS[dirval_str][1]);
                temp_array.push(this.get_tile(row, col));
            }
            // Merge. 
            var merged_array = merge(temp_array);
            if (merged_array != temp_array) {
                is_grid_changed = true;
            }
            // Iterate over tiles in traversal_dir again.
            for (let tile = 0; tile < traversal_dir; tile++) {
                let row = start_row + (tile * OFFSETS[dirval_str][0]);
                let col = start_col + (tile * OFFSETS[dirval_str][1]);
                this.set_tile(row, col, merged_array[tile]);
            }
        }
        if (is_grid_changed) {
            this.new_tile();
        }
    }

}


/*
 * Class to run game GUI. 
 * @param {Object} TwentyFortyEight - Instance of TwentyFortyEight.
 */
class GUI {
    constructor(game) {
        this._rows = game.get_grid_height();
        this._cols = game.get_grid_width();
        this._game = game;
    } 
    keydown(event) {
        switch(event.key) {
            case "ArrowUp":
                this._game.move(1);
                break;
            case "ArrowDown":
                this._game.move(2);
                break;
            case "ArrowLeft":
                this._game.move(3);
                break;
            case "ArrowRight":
                this._game.move(4);
                break;
        }
    }
    draw() {
        var canvas = document.getElementById("frame");
        var ctx = canvas.getContext("2d");

        // Set canvas background color
        ctx.fillStyle = "#BCADA1";
        ctx.fillRect(0, 0, 490, 490);

        var tiles_image = document.getElementById("tiles");
        
        for (let row = 0; row < this._rows; row++) {
            for (let col = 0; col < this._cols; col++) {
                var tile = this._game.get_tile(row, col);
                var val;
                if (tile == 0) {
                    val = 0;
                } else {
                    val = Math.log2(tile);
                }
                ctx.drawImage(tiles_image, (val * TILE_SIZE), 0, TILE_SIZE, TILE_SIZE, (col * TILE_SIZE + BORDER_SIZE), (row * TILE_SIZE + BORDER_SIZE), TILE_SIZE, TILE_SIZE);
            }
        }
        document.getElementById("score-number").innerHTML = score;
    }
    start() {
        this._game.reset();
        score = 0;
    }
}

var game = new TwentyFortyEight(4, 4);
var gui = new GUI(game);
gui.start()

function load_canvas() {
    document.addEventListener("keydown", function(event) {
        gui.keydown(event)
    });
    setInterval(function() {gui.draw()}, 10);
}

// Export for unit testing
module.exports = { merge: merge, TwentyFortyEight: TwentyFortyEight };
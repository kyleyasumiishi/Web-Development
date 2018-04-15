/* 
Instructor-provided GUI code for my Tic-Tac-Toe mini project, which are part of
Rice University's Fundamentals of Computing specialization on Coursera. 
I converted this code from Python into JavaScript and made minor logic tweaks 
as part of my re-implementation of this project in JavaScript.
*/

// Constants
const GUI_WIDTH = 400;
const GUI_HEIGHT = 400;
const BAR_WIDTH = 5;

/*
 * GUI for Tic-Tac-Toe game.
 * @param {number} size - The number of rows and columns of the Tic-Tac-Toe board.
 * @param {number} aiplayer - Variable PLAYERX or PLAYERO, representing the numbers 2 or 3, respectively.
 * @param {function} aifunction - Either mc_move if Monte Carlo game selected, or move_wrapper if MiniMax game selected.
 * @param {number} ntrials - A number of trials.
 * @param {Boolean} reverse - Represents whether the game is played in reverse (true) or not (false=default). In Reverse Tic-Tac-Toe, the player wins if the opponent gets 3 in a row. 
 */
function GUI(size, aiplayer, aifunction, ntrials, reverse) {
    // Game board
    this._size = size;
    this._bar_spacing = Math.floor(GUI_WIDTH / this._size);
    this._turn = PLAYERX;
    this._reverse = reverse;
    // AI setup
    this._humanplayer = switch_player(aiplayer);
    this._aiplayer = aiplayer;
    this._aifunction = aifunction;
    this._ntrials = ntrials;

    this.new_game = function() {
        this._board = new TTTBoard(this._size, this._reverse);
        this._inprogress = true;
        this._wait = false;
        this._turn = PLAYERX;
        this._label = "";
        // Clear canvas
        var canvas = document.getElementById("frame");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, GUI_WIDTH, GUI_HEIGHT);
        for (var bar_start = this._bar_spacing; bar_start<GUI_WIDTH - 1; bar_start += this._bar_spacing) {
            ctx.fillStyle = "black";
            ctx.lineWidth = BAR_WIDTH;
            // vertical lines
            ctx.beginPath();
            ctx.moveTo(bar_start, 0);
            ctx.lineTo(bar_start, GUI_HEIGHT);
            ctx.stroke();
            ctx.closePath();
            // horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, bar_start);
            ctx.lineTo(GUI_WIDTH, bar_start);
            ctx.stroke();
            ctx.closePath();
        }
    }

    this.draw = function() {
        var canvas = document.getElementById("frame");
        var ctx = canvas.getContext("2d");
        
        var status = document.getElementById("status");
        status.innerHTML = this._label;

        for (var bar_start = this._bar_spacing; bar_start<GUI_WIDTH - 1; bar_start += this._bar_spacing) {
            ctx.fillStyle = "black";
            ctx.lineWidth = BAR_WIDTH;
            // vertical lines
            ctx.beginPath();
            ctx.moveTo(bar_start, 0);
            ctx.lineTo(bar_start, GUI_HEIGHT);
            ctx.stroke();
            ctx.closePath();
            // horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, bar_start);
            ctx.lineTo(GUI_WIDTH, bar_start);
            ctx.stroke();
            ctx.closePath();
            // Draw current players' moves
            for (var row = 0; row < this._size; row++) {
                for (var col = 0; col < this._size; col++) {
                    var symbol = this._board.square(row, col);
                    var coords = this.get_coords_from_grid(row, col);
                    if (symbol == PLAYERX) {
                        this.drawx(ctx, coords);
                    } else if (symbol == PLAYERO) {
                        this.drawo(ctx, coords);
                    }
                }
            }
            // Run AI, if necessary
            if (!this._wait) {
                this.aimove();
            } else {
                this._wait = false;
            }
        }
    }

    this.drawx = function(ctx, pos) {
        var halfsize = 0.4 * this._bar_spacing;
        ctx.fillStyle = "black";
        ctx.lineWidth = BAR_WIDTH;
        // backslash "\"
        ctx.beginPath();
        ctx.moveTo(pos[0] - halfsize, pos[1] - halfsize);
        ctx.lineTo(pos[0] + halfsize, pos[1] + halfsize);
        ctx.stroke();
        ctx.closePath();
        // forward slash "/"
        ctx.beginPath();
        ctx.moveTo(pos[0] + halfsize, pos[1] - halfsize);
        ctx.lineTo(pos[0] - halfsize, pos[1] + halfsize);
        ctx.stroke();
        ctx.closePath();
    }

    this.drawo = function(ctx, pos) {
        var halfsize = 0.4 * this._bar_spacing;
        ctx.fillStyle = "black";
        ctx.lineWidth = BAR_WIDTH;
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], halfsize, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }

    this.click = function(position) {
        if (this._inprogress && (this._turn == this._humanplayer)) {
            var col = this.get_grid_from_coords(position)[0];
            var row = this.get_grid_from_coords(position)[1];
            if (this._board.square(row, col) == EMPTY) {
                this._board.move(row, col, this._humanplayer);
                this._turn = this._aiplayer;
                var winner = this._board.check_win();
                if (winner != null) {
                    this.game_over(winner);
                }
                this._wait = true;
            }
        }
    } 

    this.aimove = function() {
        if (this._inprogress && (this._turn == this._aiplayer)) {
            var ai_move = this._aifunction(this._board, this._aiplayer, this._ntrials); 
            var row = ai_move[0];
            var col = ai_move[1];
            if (this._board.square(row, col) == EMPTY) {
                this._board.move(row, col, this._aiplayer); 
            }
            this._turn = this._humanplayer;
            var winner = this._board.check_win();
            if (winner != null) {
                this.game_over(winner);
            }
        }
    }

    this.game_over = function(winner) {
        // Display winner
        if (winner == DRAW) {
            this._label = "Tie";
        } else if (winner == PLAYERX) {
            this._label = "X Wins!";
        } else if (winner == PLAYERO) {
            this._label = "O Wins!";
        }

        this._inprogress = false;
    }

    this.get_coords_from_grid = function(row, col) {
        return [this._bar_spacing * (col + 1.0/2.0),
                this._bar_spacing * (row + 1.0/2.0)];
    }

    this.get_grid_from_coords = function(position) {
        var posx = position[0];
        var posy = position[1];
        return [Math.floor(posx / this._bar_spacing),
                Math.floor(posy / this._bar_spacing)];
    } 
}

var gui = new GUI(3, PLAYERX, mc_move, 100, false);

function load_canvas() {
    gui.new_game();
    document.addEventListener("click", click);
    setInterval(function() {gui.draw()}, 30);
}

function click(event) {
    var canvas = document.getElementById("frame");
    var x = event.clientX - canvas.offsetLeft;
    var y = event.clientY - canvas.offsetTop;
    var position = [x, y];
    gui.click(position);
}

function new_game() {
    if (document.getElementById("mc").classList.contains("active")) {
        gui.new_game();
    } else {
        gui = new GUI(3, PLAYERX, move_wrapper, 1, false);
        gui.new_game();
    }
}

function toggle_click(id) {
    if (id == "mc") {
        document.getElementById("mc").classList.add("active");
        document.getElementById("mm").classList.remove("active");
    } else {
        document.getElementById("mm").classList.add("active");
        document.getElementById("mc").classList.remove("active");

    }
}
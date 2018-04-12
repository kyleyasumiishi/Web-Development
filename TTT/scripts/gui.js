/* Tic-Tac-Toe GUI */

// const TTT = require('./board');
// const mc = require('./monte-carlo');

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
}

GUI.prototype.draw = function() {
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");

    for (var bar_start = this._bar_spacing; this._bar_spacing<GUI_WIDTH; bar_start += this._bar_spacing) {
        // vertical
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.moveTo(bar_start, 0);
        ctx.lineTo(bar_start, GUI_HEIGHT);
        ctx.lineWidth = BAR_WIDTH;
        ctx.stroke();

    }

}

var gui = new GUI(3, PLAYERX, mc_move, 100, false);


function load_canvas() {
    setInterval(function() {gui.draw()}, 30);
}
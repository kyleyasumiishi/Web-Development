/* 
Instructor-provided board code for my Tic-Tac-Toe mini projects, which are part of
Rice University's Fundamentals of Computing specialization on Coursera. 
I converted this code from Python into JavaScript and made minor logic tweaks 
as part of my re-implementation of this project in JavaScript.
*/


// Constants
const EMPTY = 1;
const PLAYERX = 2;
const PLAYERO = 3;
const DRAW = 4;

/* 
 * Class to represent a Tic-Tac-Toe board.
 * @param {number} dim - The number of rows and columns.
 * @param {Boolean} reverse - Represents whether the game is played in reverse (true) or not (false=default). In Reverse Tic-Tac-Toe, the player wins if the opponent gets 3 in a row. 
 * @param {array} board - A grid of cells structured as an array of arrays that represents a Tic-Tac-Toe board. Each cell contains one of the constants EMPTY, PLAYERX, or PLAYERO.
 */
function TTTBoard(dim, reverse = false, board) {
    this._dim = dim;
    this._reverse = reverse;
    if (board != undefined) {
        this._board = board;
    } else {
        this._board = [];
        for (let row=0; row<this._dim; row++) {
            var a_row = [];
            for (let col=0; col<this._dim; col++) {
                a_row.push(EMPTY);
            }
            this._board.push(a_row);
        }
    }

    this.get_dim = function() {
        return this._dim;        
    }

    this.square = function(row, col) {
        return this._board[row][col];
    }

    this.get_empty_squares = function() {
        var empty = [];
        for (let row=0; row<this._dim; row++) {
            for (let col=0; col<this._dim; col++) {
                if (this._board[row][col] == EMPTY) {
                    empty.push([row, col]);
                }
            }
        }
        return empty;    
    }

    this.move = function(row, col, player) {
        if (this._board[row][col] == EMPTY) {
            this._board[row][col] = player;
        }
    }

    this.check_win = function() {
        var board = this._board;
    var dim = this._dim;
    var dimrng = [];
    for (let i=0; i<dim; i++) {
        dimrng.push(i);
    }
    var lines = [];
    // rows
    for (let i=0; i<board.length; i++) {
        lines.push(board[i]);
    }
    // cols
    var cols = [];
    for (let colidx of dimrng) {
        var col = [];
        for (let rowidx of dimrng) {
            col.push(board[rowidx][colidx]);
        }
        cols.push(col);
    }
    cols.forEach(col => lines.push(col));
    // diags
    var diag1 = [];
    for (let idx of dimrng) {
        diag1.push(board[idx][idx]);
    }
    var diag2 = [];
    for (let idx of dimrng) {
        diag2.push(board[idx][dim - idx - 1]);
    }
    lines.push(diag1);
    lines.push(diag2);
    // check all lines
    for (let line of lines) {
        let line_set = new Set(line);
        if (line_set.size == 1 && (line[0] == PLAYERX || line[0] == PLAYERO)) {
            if (this._reverse) {
                return switch_player(line[0]);
            } else {
                return line[0];
            }
        }
    }
    // no winner, check for draw
    if (this.get_empty_squares().length == 0) {
        return DRAW;
    }
    // game is still in progress
    return null;
    }

    this.clone = function() {
        var shallow_copy = new TTTBoard(this._dim, this._reverse, this._board);
        var JSON_clone = JSON.parse(JSON.stringify(shallow_copy));
        return new TTTBoard(JSON_clone["_dim"], JSON_clone["_reverse"], JSON_clone["_board"]);
    }
}

/*
 * Simple function that switches player.
 * @param {number} player - Variable PLAYERX or PLAYERO. representing the numbers 2 or 3, respectively.
 */
function switch_player(player) {
    if (player == PLAYERX) {
        return PLAYERO;
    } else {
        return PLAYERX;
    }
} 

/*
 * Function to play a game with two Monte Carlo machine players.
 * @param {function} mc_move_function - A function that uses the Monte Carlo simulation to return a move for the player in the form of a [row, col] array.
 * @param {number} ntrials - The number of trials.
 * @param {Boolean} reverse - Represents whether the game is played in reverse (true) or not (false=default).
 */
function play_game(mc_move_function, ntrials, reverse) {
    if (reverse == true) {
        var board = new TTTBoard(3, true);
    } else {
        var board = new TTTBoard(3);
    }
    var curplayer = PLAYERX;
    var winner = null;
    // Run game
    while (winner == null) {
        // Move
        var best_move = mc_move_function(board, curplayer, ntrials);
        board.move(best_move[0], best_move[1], curplayer);
        // Update state
        winner = board.check_win();
        curplayer = switch_player(curplayer);
        // Display board
        console.log(board._board);
    }
    // Print winner
    if (winner == PLAYERX) {
        console.log("X wins!");
    } else if (winner == PLAYERO) {
        console.log("O wins!");
    } else if (winner == DRAW) {
        console.log("Tie!")
    } else {
        console.log("Error: unknown winner");
    }
}


module.exports = { TTTBoard: TTTBoard, EMPTY: EMPTY, PLAYERX: PLAYERX, PLAYERO: PLAYERO, DRAW: DRAW, switch_player: switch_player, play_game: play_game };
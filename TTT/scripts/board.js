// Constants
const EMPTY = 1;
const PLAYERX = 2;
const PLAYERO = 3;
const DRAW = 4;



function TTTBoard(dim, reverse, board) {
    this._dim = dim;
    if (reverse == true) {
        this._reverse = reverse;
    } else {
        this._reverse = false;
    }
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
}

TTTBoard.prototype.get_dim = function() {
    return this._dim;
}

TTTBoard.prototype.square = function(row, col) {
    return this._board[row][col];
}

TTTBoard.prototype.get_empty_squares = function() {
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

TTTBoard.prototype.move = function(row, col, player) {
    if (this._board[row][col] == EMPTY) {
        this._board[row][col] = player;
    }
}

TTTBoard.prototype.check_win = function() {
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
        if (line_set.size == 1 && line[0] != EMPTY) {
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

function switch_player(player) {
    if (player == PLAYERX) {
        return PLAYERO;
    } else {
        return PLAYERX;
    }
} 
 
function play_game(mc_move_function, ntrials, reverse) {
    if (reverse == true) {
        var board = TTTBoard(3, true);
    } else {
        var board = TTTBoard(3);
    }
    var curplayer = PLAYERX;
    var winner = null;
    // Run game
    while (winner == null) {
        // Move
        
    }
}

var is_und = null;
console.log(is_und);


module.exports = { TTTBoard: TTTBoard, EMPTY: EMPTY, PLAYERX: PLAYERX, PLAYERO: PLAYERO, DRAW: DRAW, switch_player: switch_player };
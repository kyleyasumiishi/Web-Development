const board = require('./board');
const mc = require('./monte-carlo');


// TTTBoard Object
var board_1 = new board.TTTBoard(3);
var board_2 = new board.TTTBoard(3, true, [[2, 2, 2],[1, 1, 1],[3, 3, 3]]);
test('Test object constructor - this._dim', () => {
    expect(board_1._dim).toBe(3);
})
test('Test object constructor - this._reverse', () => {
    expect(board_1._reverse).toBe(false);
})
test('Test object constructor - this._reverse', () => {
    expect(board_2._reverse).toBe(true);
})
test('Test object constructor - this._board', () => {
    expect(board_1._board).toEqual([[1,1,1],[1,1,1],[1,1,1]]);
})
test('Test object constructor - this._board', () => {
    expect(board_2._board).toEqual([[2,2,2],[1,1,1],[3,3,3]]);
})
test('get_dim()', () => {
    expect(board_1.get_dim()).toBe(3);
})
test('get_dim()', () => {
    expect(board_2.get_dim()).toBe(3);
})
test('square(0, 0)', () => {
    expect(board_1.square(0, 0)).toBe(1);
})
test('square(0, 0)', () => {
    expect(board_2.square(0, 0)).toBe(2);
})
test('get_empty_squares', () => {
    expect(board_1.get_empty_squares()).toEqual([[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]);
})
test('get_empty_squares', () => {
    expect(board_2.get_empty_squares()).toEqual([[1,0],[1,1],[1,2]]);
})
var board_3 = new board.TTTBoard(3);
board_3.move(0,0,board.PLAYERX);
test('move', () => {
    expect(board_3.square(0,0)).toBe(2);
})
var board_4 = new board.TTTBoard(3, false, [[2,3,0],[1,2,1],[1,3,2]]);
test('check_win - PLAYERX', () => {
    expect(board_4.check_win()).toBe(board.PLAYERX);
})
var board_5 = new board.TTTBoard(3, false, [[3,2,3],[3,2,2],[2,3,2]]);
test('check_win - DRAW', () => {
    expect(board_5.check_win()).toBe(board.DRAW);
})
var board_6 = new board.TTTBoard(3, true, [[2,3,0],[1,2,1],[1,3,2]]);
test('check_win - PLAYERO', () => {
    expect(board_6.check_win()).toBe(board.PLAYERO);
})
test('check_win - game in progress', () => {
    expect(board_1.check_win()).toBe(null);
})

// clone
var board_13 = new board.TTTBoard(3);
var board_13_clone = board_13.clone();
test('clone - check board', () => {
    expect(board_13._board).toEqual(board_13_clone._board);
})
test('clone - check dim', () => {
    expect(board_13.get_dim()).toBe(board_13_clone.get_dim());
})
test('clone - check empty squares', () => {
    expect(board_13.get_empty_squares()).toEqual(board_13_clone.get_empty_squares());
})
test('clone - check different objects', () => {
    expect(board_13).not.toBe(board_13_clone);
})


// Switch Player
test('switch_player', () => {
    expect(board.switch_player(board.PLAYERX)).toBe(board.PLAYERO);
})
test('switch_player', () => {
    expect(board.switch_player(board.PLAYERO)).toBe(board.PLAYERX);
})

// mc_trial
var board_7 = new board.TTTBoard(3);
mc.mc_trial(board_7, board.PLAYERX);
test('mc_trial - check if completes game', () => {
    expect(board_7.check_win()).not.toBe(null);
}) 

var trial_results = [];
var players = [board.PLAYERX, board.PLAYERO];
function gen_trial_results() {
    let random_dim = Math.floor(Math.random() * 8);
    let random_board = new board.TTTBoard(random_dim);
    let player = players[Math.floor(Math.random() * 2)];
    mc.mc_trial(random_board, player);
    trial_results.push(random_board.check_win());
}
for (let i=0; i<200; i++) {
    gen_trial_results();
}
var null_results = trial_results.filter(result => result == null);
test('mc_trial - check if completes game x 200', () => {
    expect(null_results.length).toBe(0);
})

// mc_update_scores
var board_8 = new board.TTTBoard(3, undefined, [[3,2,1],[1,3,1],[1,2,3]]);
var board_8_scores = [[0,0,0],[0,0,0],[0,0,0]];
mc.mc_update_scores(board_8_scores, board_8, board.PLAYERO);
test('mc_update_scores - PLAYERO wins', () => {
    expect(board_8_scores).toEqual([[1, -1, 0],[0, 1, 0],[0, -1, 1]]);
})

var board_9 = new board.TTTBoard(3, undefined, [[0,0,0],[0,0,0],[0,0,0]]);
var board_9_scores = [[0,0,0],[0,0,0],[0,0,0]];
mc.mc_update_scores(board_9_scores, board_9, board.PLAYERO);
test('mc_update_scores - erroneous board values', () => {
    expect(board_9_scores).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
})

var board_10 = new board.TTTBoard(3, undefined, [[1, 1, 1],[1, 1, 1],[1, 1, 1]]);
var board_10_scores = [[0,0,0],[0,0,0],[0,0,0]];
mc.mc_update_scores(board_10_scores, board_10, board.PLAYERO);
test('mc_update_scores - empty board', () => {
    expect(board_10_scores).toEqual([[0,0,0],[0,0,0],[0,0,0]]);
})

// get_best_move
var board_11 = new board.TTTBoard(3, undefined, [[1,1,1],[1,1,1],[1,1,1]]);
var board_11_scores = [[0,0,0],[0,0,20],[0,0,0]];
test('get_best_move - single best move', () => {
    expect(mc.get_best_move(board_11, board_11_scores)).toEqual([1,2]);
})

/*
 * Helper function for testing get_best_move when there are more than one empty squares with the maximum score. Returns true if arr (returned value from get_best_move) is included in arr_of_arr; false otherwise.
 * @param {Array} arr - The returned square, represented as a [row, col] array, from get_best_move.
 * @param {Array} arr_of_arr - An array containing multiple squares, each represented as a [row, col] array, with the maximum score.
 */
function is_array_in_array(arr, arr_of_arr) {
    for (let a of arr_of_arr) {
        var ans = true;
        for (let i = 0; i<a.length; i++) {
            if (arr[i] != a[i]) {
                ans = false;
                break;
            }
        }
        if (ans) {
            return true;
        }
    } 
    return false;
}

var board_12 = new board.TTTBoard(3, undefined, [[1,1,1],[1,1,1],[1,1,1]]);
var board_12_scores = [[0,0,10],[20,0,20],[0,-10,0]];
var board_12_best_moves = [[1,0],[1,2]];
test('get_best_move - multiple best moves', () => {
    var board_12_best_move = mc.get_best_move(board_12, board_12_scores);
    expect(is_array_in_array(board_12_best_move, board_12_best_moves)).toBeTruthy();
})

// mc_move
var board_14 = new board.TTTBoard(3);
var board_14_original = board_14.clone();
var board_14_move = mc.mc_move(board_14, board.PLAYERX, 100);
board_14.move(board_14_move[0], board_14_move[1], board.PLAYERX);
test('mc_move - check board updated', () => {
    expect(board_14._board).not.toEqual(board_14_original._board);
})
test('mc_move - check move made', () => {
    expect(board_14.get_empty_squares().length).toBeLessThan(board_14_original.get_empty_squares().length);
})
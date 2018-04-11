const board = require('./board');


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
test('check_win', () => {
    expect(board_4.check_win()).toBe(board.PLAYERX);
})
var board_5 = new board.TTTBoard(3, false, [[3,2,3],[3,2,2],[2,3,2]]);
test('check_win', () => {
    expect(board_5.check_win()).toBe(board.DRAW);
})
var board_6 = new board.TTTBoard(3, true, [[2,3,0],[1,2,1],[1,3,2]]);
test('check_win', () => {
    expect(board_6.check_win()).toBe(board.PLAYERO);
})
test('check_win', () => {
    expect(board_1.check_win()).toBe(null);
})

// Switch Player
test('switch_player', () => {
    expect(board.switch_player(board.PLAYERX)).toBe(board.PLAYERO);
})
test('switch_player', () => {
    expect(board.switch_player(board.PLAYERO)).toBe(board.PLAYERX);
})
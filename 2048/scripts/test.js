const main = require('./main');

// Test merge function
test('merge([2, 0, 2, 4])', () => {
    expect(main.merge([2, 0, 2, 4])).toEqual([4, 4, 0, 0]);
})

test('merge([0, 0, 2, 2])', () => {
    expect(main.merge([0, 0, 2, 2])).toEqual([4, 0, 0, 0]);
})

test('merge([2, 2, 0, 0])', () => {
    expect(main.merge([2, 2, 0, 0])).toEqual([4, 0, 0, 0]);
})

test('merge([2, 2, 2, 2, 2])', () => {
    expect(main.merge([2, 2, 2, 2, 2])).toEqual([4, 4, 2, 0, 0]);
})

test('merge([8, 16, 16, 8])', () => {
    expect(main.merge([8, 16, 16, 8])).toEqual([8, 32, 8, 0]);
})

// Test TwentyFortyEight class
var class_4x4 = new main.TwentyFortyEight(4, 4);
test('get_grid_height', () => {
    expect(class_4x4.get_grid_height()).toBe(4);
})

test('get_grid_width', () => {
    expect(class_4x4.get_grid_width()).toBe(4);
})

let empty_squares_4x4 = class_4x4.get_empty_tiles();
test('4x4 grid', () => {
    expect(empty_squares_4x4.length).toBe(14);
})

test('initial_up', () => {
    expect(class_4x4._initial_up).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
})

test('initial_down', () => {
    expect(class_4x4._initial_down).toEqual([[3, 0], [3, 1], [3, 2], [3, 3]]);
})

test('initial_left', () => {
    expect(class_4x4._initial_left).toEqual([[0, 0], [1, 0], [2, 0], [3, 0]]);
})

test('initial_right', () => {
    expect(class_4x4._initial_right).toEqual([[0, 3], [1, 3], [2, 3], [3, 3]]);
})

test('initial_tiles', () => {
    expect(class_4x4._initial_tiles[1]).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
    expect(class_4x4._initial_tiles[2]).toEqual([[3, 0], [3, 1], [3, 2], [3, 3]]);
    expect(class_4x4._initial_tiles[3]).toEqual([[0, 0], [1, 0], [2, 0], [3, 0]]);
    expect(class_4x4._initial_tiles[4]).toEqual([[0, 3], [1, 3], [2, 3], [3, 3]]);    
})

var class_2x2 = new main.TwentyFortyEight(2, 2);
class_2x2.set_tile(0, 0, 8);
test('set_tile', () => {
    expect(class_2x2._grid[0][0]).toBe(8);
})

test('get_tile', () => {
    expect(class_2x2.get_tile(0, 0)).toBe(8);
})

var class_3x3 = new main.TwentyFortyEight(3, 3);
class_3x3.new_tile();
class_3x3.new_tile();
class_3x3.new_tile();
var empty_tiles = class_3x3.get_empty_tiles();
test('new_tile', () => {
    expect(empty_tiles.length).toBe(4);
})

var class_2x2_2 = new main.TwentyFortyEight(2, 2, [[0, 0], [2, 2]]);
class_2x2_2.move(1);
test('move up', () => {
    expect(class_2x2_2._grid[0]).toEqual([2, 2]);
})

var class_4x4_2 = new main.TwentyFortyEight(4, 4, [[2, 2, 2, 2],[2, 2, 2, 2], [0, 0, 0, 0], [2, 2, 2, 2]]);
class_4x4_2.move(2);
test('move down', () => {
    expect(class_4x4_2._grid[3]).toEqual([4, 4, 4, 4]);
})

test('move down', () => {
    expect(class_4x4_2._grid[2]).toEqual([2, 2, 2, 2]);
})

var class_3x3_2 = new main.TwentyFortyEight(3, 3, [[0, 0, 0],[2, 2, 2],[4, 2, 0]]);
class_3x3_2.move(3);
test('move left', () => {
    expect(class_3x3_2.get_tile(1, 0)).toBe(4);
})

test('move left', () => {
    expect(class_3x3_2.get_tile(2, 0)).toBe(4);
})

var class_3x3_3 = new main.TwentyFortyEight(3, 3, [[4, 4, 4],[2, 2, 2],[0, 2, 2]]);
class_3x3_3.move(4);
test('move right', () => {
    expect(class_3x3_3.get_tile(0, 2)).toBe(8);
})

test('move right', () => {
    expect(class_3x3_3.get_tile(1, 2)).toBe(4);
})

test('move right', () => {
    expect(class_3x3_3.get_tile(2, 2)).toBe(4);
})
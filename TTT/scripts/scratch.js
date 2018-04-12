const board = require('./board');
const mc = require('./monte-carlo');

board.play_game(mc.mc_move, 100);

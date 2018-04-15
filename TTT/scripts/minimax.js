/* 
MiniMax Tic-Tac-Toe

This is the student portion of my MiniMax Tic-Tac-Toe mini project,
which I built as part of Rice University's Fundamentals of Computing specialization on Coursera. 
I converted this code from Python into JavaScript and made minor logic tweaks 
as part of my re-implementation of this project in JavaScript.
*/

// const TTT = require('./board');

// Scoring Values
const SCORES = {
    PLAYERX: 1,
    DRAW: 0,
    PLAYERO: -1
};

const random_first_move = [[0,0],[0,2],[1,1],[2,0],[2,2]];

/*
 * Returns an array with two elements. The first element is the score of the given board and the second element is the desired move as a [row, col] array.
 * @param {Object} board - An instance of TTTBoard.
 * @param {number} player - Variable PLAYERX or PLAYERO. representing the numbers 2 or 3, respectively. 
 */
function mm_move(board, player) {
    if (board.get_empty_squares().length == 9) {
        if (player == PLAYERX) {
            return [1, random_first_move[Math.floor(Math.random() * random_first_move.length)]];
        } else {
            return [-1, random_first_move[Math.floor(Math.random() * random_first_move.length)]];
        }
    } else {
         // Base case
        var winner = board.check_win();
        if (winner == PLAYERX) {
            return [SCORES.PLAYERX, [-1, -1]];
        } else if (winner == PLAYERO) {
            return [SCORES.PLAYERO, [-1, -1]];
        } else if (winner == DRAW) {
            return [SCORES.DRAW, [-1, -1]];
        } 
        // Recursive case
        else {
            // scores_and_moves is an array of the form [score, [row, col]].
            var scores_and_moves = [];
            var empty_squares = board.get_empty_squares();
            var next_player = switch_player(player);

            /*
            For each empty square, clone board and move player to that square.
            Then, recursively call mm_move with cloned board. 
            Returns score that minimizes the maximum loss (-1 for O, +1 for X). 
            */
            empty_squares.forEach(function(square) {
                var clone = board.clone();
                clone.move(square[0], square[1], player);
                scores_and_moves.unshift([mm_move(clone, next_player)[0], square]);

                // Returns first square that minimizes the maximum loss.
                if (player == PLAYERX && scores_and_moves[0][0] == 1) {
                    return scores_and_moves[0];
                } else if (player == PLAYERO && scores_and_moves[0][0] == -1) {
                    return scores_and_moves[0];
                }
            })

            // Returns a square with a score of 0.
            if (player == PLAYERX) {
                return scores_and_moves.sort()[scores_and_moves.length - 1];
            } else {
                return scores_and_moves.sort()[0];
            }
        }
    }
}
     
function move_wrapper(board, player, trials) {
    var move = mm_move(board, player);
    return move[1];
}

// module.exports = { mm_move: mm_move, EMPTY: EMPTY, PLAYERX: PLAYERX, PLAYERO: PLAYERO, DRAW: DRAW };
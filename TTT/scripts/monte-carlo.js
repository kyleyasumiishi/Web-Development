/* 
Monte Carlo Tic-Tac-Toe

This is the student portion of my Monte Carlo Tic-Tac-Toe mini project,
which I built as part of Rice University's Fundamentals of Computing specialization on Coursera. 
I converted this code from Python into JavaScript and made minor logic tweaks 
as part of my re-implementation of this project in JavaScript.
*/

// const TTT = require('./board');

// Constants
const NTRIALS = 100;
var SCORE_CURRENT = 1.0;
var SCORE_OTHER = 1.0; 

/*
 * Plays a game starting with the given player by making random moves, alternating between players.
 * @param {Object} board - An instance of TTTBoard.
 * @param {number} player - Variable PLAYERX or PLAYERO. representing the numbers 2 or 3, respectively.
 */
function mc_trial(board, player) {
    var curr_player = player;
    for (let i=0; i<board.get_empty_squares().length; i++) {
        while (board.check_win() == null) {
            var empty_squares = board.get_empty_squares();
            var random_empty_square = empty_squares[Math.floor(Math.random() * empty_squares.length)];
            board.move(random_empty_square[0], random_empty_square[1], curr_player);
            curr_player = switch_player(player);
        }
    }
}

/*
 * Scores a completed board and update scores array.
 * @param {Array} scores - A grid of scores represented as an array of arrays.
 * @param {Object} board - An instance of TTTBoard that has a completed board.
 * @param {number} player - Variable PLAYERX or PLAYERO representing the numbers 2 or 3, respectively.
 */
function mc_update_scores(scores, board, player) {
    var winner = board.check_win();
    var dim = board.get_dim();
    // scores only updated when completed game has a winner.
    if (winner != DRAW && winner != null) {
        for (var col=0; col<dim; col++) {
            for (var row=0; row<dim; row++) {
                var square = board.square(row, col);
                // player wins
                if (winner == player) {
                    if (square == winner) {
                        scores[row][col] += SCORE_CURRENT;
                    } else if (square != EMPTY) {
                        scores[row][col] -= SCORE_OTHER;
                    }
                // player loses
                } else if (winner != player) {
                    if (square == winner) {
                        scores[row][col] += SCORE_OTHER;
                    } else if (square != EMPTY) {
                        scores[row][col] -= SCORE_CURRENT;
                    }
                }
            }
        }
    }
}

/*
 * Finds all the empty squares with the maximum score and randomly returns one of them as an [row, col] array.
 * @param {Object} board - An instance of TTTBoard.
 * @param {Array} scores - A grid of scores represented as an array of arrays.
 */
function get_best_move(board, scores) {
    var max_score = -1 * NTRIALS;
    var empty_squares = board.get_empty_squares();
    // Find maximum score.
    empty_squares.forEach(function(square) {
        if ((scores[square[0]][square[1]]) >= max_score) {
            max_score = scores[square[0]][square[1]];
        }
    })
    // Create list of all empty squares with maximum score.
    var max_scores = empty_squares.filter(square => scores[square[0]][square[1]] == max_score);
    // Return random empty square with maximum score.
    return max_scores[Math.floor(Math.random() * max_scores.length)];
}

/*
 * Uses the Monte Carlo simulation to return a move for the player in the form of a [row, col] array.
 * @param {Object} board - An instance of TTTBoard.
 * @param {number} player - Variable PLAYERX or PLAYERO.
 * @param {number} trials - The number of trials to run in the simulation.
 */
function mc_move(board, player, trials) {
    var dim = board.get_dim();
    var scores = [];
    for (let row=0; row<dim; row++) {
        var a_row = [];
        for (let col=0; col<dim; col++) {
            a_row.push(0);
        }
        scores.push(a_row);
    }

    for (let i=0; i<trials; i++) {
        let board_clone = board.clone();
        mc_trial(board_clone, player);
        mc_update_scores(scores, board_clone, player);
    }
    return get_best_move(board, scores);

}


 module.exports = { mc_trial: mc_trial, mc_update_scores: mc_update_scores, get_best_move: get_best_move, mc_move: mc_move };
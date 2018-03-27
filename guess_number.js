/*
Simple Guess the Number game. 

Input will come from buttons and an input field.
All output will be printed on the webpage.
*/

var SECRET_NUM = Math.floor(Math.random() * 100); 
var MAX_GUESSES = 7;
var CURRENT_GUESS = 0;
var msg1 = "";
var msg2 = "";

function new_game() {
    // Resets current guess number CURRENT_GUESS to 0.
    CURRENT_GUESS = 0;
}

function range100() {
    // Starts a new game, with a range of [0, 100).
    MAX_GUESSES = 7;
    SECRET_NUM = Math.floor(Math.random() * 100); 
    return new_game();
}

function input_guess(guess) {
    /* Converts the string guess to an integer, and 
    compares it with the secret number SECRET_NUM. */
    var guess_int = Number(guess);
    msg1 = "Guess was " + guess + ".";
    document.getElementById("m1").innerHTML = msg1;        
    
    if ((guess != undefined) && (guess_int > 0)) {
        CURRENT_GUESS += 1;
        var remaining_guesses = MAX_GUESSES - CURRENT_GUESS;
        if ((remaining_guesses == 0) && (guess_int != SECRET_NUM)) {
            msg2 = "Game over. Secret number was " + SECRET_NUM.toString() + ".";
            document.getElementById("m2").innerHTML = msg2; 
        } else if (guess_int < SECRET_NUM) {
            msg2 = "Higher \n Remaining guesses: " + remaining_guesses.toString() + ".";
            document.getElementById("m2").innerHTML = msg2; 
        } else if (guess_int > SECRET_NUM) {
            msg2 = "Lower \n Remaining guesses: " + remaining_guesses.toString() + ".";
            document.getElementById("m2").innerHTML = msg2; 
        } else {
            msg2 = "Correct! Secret number was " + SECRET_NUM.toString() + ".";
            document.getElementById("m2").innerHTML = msg2; 
        }
    } else {
        msg2 = "Guess must be a non-negative integer.";
        document.getElementById("m2").innerHTML = msg2; 
    } return false;
}
   



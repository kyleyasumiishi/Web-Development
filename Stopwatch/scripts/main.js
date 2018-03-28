/*
Stopwatch: The Game
*/

// Global variables
var COUNT = 0;
var TOTAL_STOPS = 0;
var SUCCESSFUL_STOPS = 0;
var IS_TIMER_STOPPED = true;

// Helper functions

function format(t) {
    // Returns a string of the count t in A:BC.D format.
    var minutes = Math.floor(t / 600);
    var seconds = Math.floor((t % 600) / 10);
    seconds = (seconds < 10) ? ("0" + seconds) : seconds; 
    var milliseconds = (t % 600) % 10;
    return minutes.toString() + ":" + seconds.toString() + "." + milliseconds.toString();
}

function stop_count_format(success, total) {
    // Returns a string of the quotient of successful stops over total stops.
    return success.toString() + "/" + total.toString();
}

// Event handlers for buttons

function start() {
    // Starts timer and changes global variable IS_TIMER_STOPPED to false.
    IS_TIMER_STOPPED = false;
    timer = setInterval(function() {time(); print_count(); print_score();}, 100);
}

function stop() {
    // Stops timer, changes IS_TIMER_STOPPED to true, and updates SUCCESSFUL_STOPS and TOTAL_STOPS.
    clearInterval(timer)
    if (IS_TIMER_STOPPED == false) {
        TOTAL_STOPS++;
    } 
    if ((COUNT % 10 == 0) && (IS_TIMER_STOPPED == false)) {
        SUCCESSFUL_STOPS++;
    }
    IS_TIMER_STOPPED = true;
    print_score();
}

function reset() {
    // Stops timer and resets all global variables.
    clearInterval(timer);
    COUNT = 0;
    SUCCESSFUL_STOPS = 0;
    TOTAL_STOPS = 0;
    print_count();
    print_score();
}

// Event handler for timer
function time() {
    // Increases COUNT by 1 every 0.1 seconds.
    COUNT++;
}

function print_count() {
    // Update HTML to show formatted timer.
    var formatted = format(COUNT);
    document.getElementById("timer").innerHTML = formatted;
}

function print_score() {
    // Update HTML to show score.
    document.getElementById("score").innerHTML = "Score: ".bold() + stop_count_format(SUCCESSFUL_STOPS, TOTAL_STOPS);
}
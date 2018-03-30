/*
Clone of the classic arcade game Pong.
*/

// Global Variables
var WIDTH = 600;
var HEIGHT = 400;
var BALL_RADIUS = 20;
var PAD_WIDTH = 8;
var PAD_HEIGHT = 80;
var HALF_PAD_WIDTH = PAD_WIDTH / 2;
var HALF_PAD_HEIGHT = PAD_HEIGHT / 2;
var ball_pos = [(WIDTH / 2), (HEIGHT / 2)]; 
var ball_vel = [0, 0];
var paddle1_pos = HEIGHT / 2;
var paddle1_vel = 0;
var paddle2_pos = HEIGHT / 2;
var paddle2_vel = 0;
var score1 = 0;
var score2 = 0;

/////////////////////////////////////////////////////////////////////////////////////

// Draw canvas when page loads

function load_canvas() {
    setInterval(function() {draw()}, 1);
}

/////////////////////////////////////////////////////////////////////////////////////

function new_game() {
    // Reset global variables for ball, paddles, and scores
    ball_pos = [(WIDTH / 2), (HEIGHT / 2)]; 
    ball_vel = [0, 0];
    paddle1_pos = HEIGHT / 2;
    paddle1_vel = 0;
    paddle2_pos = HEIGHT / 2;
    paddle2_vel = 0;
    score1 = 0;
    score2 = 0;
}

function spawn_ball(direction) {
    // Randomly sets the velocity of the ball in the given direction.
    if (direction == "right") {
        ball_vel[0] = (Math.floor(Math.random() * 120) + 120) / 600;
        ball_vel[1] = - (Math.floor(Math.random() * 120) + 60) / 600;
    } else if (direction == "left") {
        ball_vel[0] = - (Math.floor(Math.random() * 120) + 120) / 600;
        ball_vel[1] = - (Math.floor(Math.random() * 120) + 60) / 600;
    }
}

/////////////////////////////////////////////////////////////////////////////////////

// Event handlers

function draw() {
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");

    // Set canvas background color to black
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 600, 400);
    
    // draw mid line
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.strokeStyle="white";
    ctx.stroke();
    
    // draw left gutter
    ctx.moveTo(PAD_WIDTH, 0);
    ctx.lineTo(PAD_WIDTH, HEIGHT);
    ctx.strokeStyle="white";
    ctx.stroke()
    
    // draw right gutter
    ctx.moveTo(WIDTH - PAD_WIDTH, 0);
    ctx.lineTo(WIDTH - PAD_WIDTH, HEIGHT);
    ctx.strokeStyle="white";
    ctx.stroke();
    
    // draw scores
    ctx.font = "30px Arial";
    ctx.fillStyle = "#ffffff"
    ctx.fillText(score1.toString(), WIDTH / 4, HEIGHT / 4);
    ctx.fillText(score2.toString(), WIDTH * .75, HEIGHT / 4);

    // draw ball
    ctx.beginPath();
    ctx.arc(ball_pos[0], ball_pos[1], BALL_RADIUS, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fillStyle="#ffffff";
    ctx.fill();
    
    // update ball, keep ball on the screen
    if ((ball_pos[1] <= BALL_RADIUS) || (ball_pos[1] >= HEIGHT - BALL_RADIUS)) {
        ball_vel[1] = - ball_vel[1];
    } 
    ball_pos[0] += ball_vel[0];
    ball_pos[1] += ball_vel[1];
    
    // draw left paddle
    ctx.moveTo(HALF_PAD_WIDTH + 0.5, paddle1_pos + HALF_PAD_HEIGHT);
    ctx.lineTo(HALF_PAD_WIDTH + 0.5, paddle1_pos - HALF_PAD_HEIGHT);
    ctx.lineWidth = PAD_WIDTH;
    ctx.stroke();
    
    // draw right paddle
    ctx.moveTo(WIDTH - HALF_PAD_WIDTH - 0.5, paddle2_pos + HALF_PAD_HEIGHT);
    ctx.lineTo(WIDTH - HALF_PAD_WIDTH - 0.5, paddle2_pos - HALF_PAD_HEIGHT);
    ctx.lineWidth = PAD_WIDTH;
    ctx.stroke();

    // Reset the line width to 1 px after drawing paddles
    ctx.lineWidth = 1;

    // update paddle's vertical position, keep paddle on the screen
    if ((paddle1_pos + paddle1_vel >= HALF_PAD_HEIGHT) && (paddle1_pos + paddle1_vel <= HEIGHT - HALF_PAD_HEIGHT)) {
        paddle1_pos += paddle1_vel;
    } else if ((paddle2_pos + paddle2_vel >= HALF_PAD_HEIGHT) && (paddle2_pos + paddle2_vel <= HEIGHT - HALF_PAD_HEIGHT)) {
        paddle2_pos += paddle2_vel;
    }

    // determine whether paddle and ball collide
    // if ((ball_pos[0] <= BALL_RADIUS + PAD_WIDTH) && ((paddle1_pos - HALF_PAD_HEIGHT) < ball_pos[1] < (paddle1_pos + HALF_PAD_HEIGHT))) {
    //     ball_vel[0] = - ball_vel[0] * 1.1;
    // } else if ((ball_pos[0] >= WIDTH - BALL_RADIUS - PAD_WIDTH) && ((paddle2_pos - HALF_PAD_HEIGHT) < ball_pos[1] < (paddle2_pos + HALF_PAD_HEIGHT))) {
    //     ball_vel[0] = - ball_vel[0] * 1.1;
    // } else if (ball_pos[0] <= BALL_RADIUS + PAD_WIDTH) {
    //     ball_pos = [(WIDTH / 2), (HEIGHT / 2)];
    //     spawn_ball("right");
    //     score2 += 1;
    // } else if (ball_pos[0] >= WIDTH - BALL_RADIUS - PAD_WIDTH) {
    //     ball_pos = [(WIDTH / 2), (HEIGHT / 2)];
    //     spawn_ball("left");
    //     score1 += 1;
    // }

    if ((ball_pos[0] <= BALL_RADIUS + PAD_WIDTH) && ((paddle1_pos - HALF_PAD_HEIGHT) < ball_pos[1] < (paddle1_pos + HALF_PAD_HEIGHT))) {
        ball_vel[0] = -1 * ball_vel[0] * 1.1;
    } else if ((ball_pos[0] >= WIDTH - BALL_RADIUS - PAD_WIDTH) && ((paddle2_pos - HALF_PAD_HEIGHT) < ball_pos[1] < (paddle2_pos + HALF_PAD_HEIGHT))) {
        ball_vel[0] = -1 * ball_vel[0] * 1.1;
    } else if (ball_pos[0] <= BALL_RADIUS + PAD_WIDTH + 1) {
        ball_pos = [(WIDTH / 2), (HEIGHT / 2)];
        spawn_ball("right");
        score2 += 1;
    } else if (ball_pos[0] >= WIDTH - BALL_RADIUS - PAD_WIDTH - 1) {
        ball_pos = [(WIDTH / 2), (HEIGHT / 2)];
        spawn_ball("left");
        score1 += 1;
    }
}

function paddle1_keydown(event) {
    var key = event.keyCode;
    // w key
    if (key == 87) {
        paddle1_vel = -2;
    } 
    // s key
    if (key == 83) {
        paddle1_vel = 2;
    }
}

function paddle2_keydown(event) {
    var key2 = event.keyCode;
    // up key
    if (key2 == 38) {
        paddle2_vel = -2;
    }
    // down key
    if (key2 == 40) {
        paddle2_vel = 2;
    }
}


function paddle1_keyup(event) {
    var key = event.keyCode;
    if ((key == 87) || (key == 83)) {
        paddle1_vel = 0;
    } 
}

function paddle2_keyup(event) {
    var key2 = event.keyCode;
    if ((key2 == 38) || (key2 == 40)) {
        paddle2_vel = 0;
    }
}


function start() {
    // Start the game by giving the ball a random direction.
    if (Math.floor(Math.random() * 2) == 0) {
        var direction = "left";
    } else {
        var direction = "right";
    } 
    spawn_ball(direction);
}

function reset() {
    new_game();
    score1 = 0;
    score2 = 0;
}

document.addEventListener("keydown", paddle1_keydown);
document.addEventListener("keyup", paddle1_keyup);

document.addEventListener("keydown", paddle2_keydown);
document.addEventListener("keyup", paddle2_keyup);
// document.addEventListener("keydown", paddle1_keydown);
// document.addEventListener("keyup", function() {paddle1_keyup; paddle2_keyup});

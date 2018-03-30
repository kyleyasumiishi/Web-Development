/*
Clone of the classic arcade game Pong.
*/

var WIDTH = 600;
var HEIGHT = 400;
var BALL_RADIUS = 20;
var PAD_WIDTH = 8;
var PAD_HEIGHT = 80;
var HALF_PAD_WIDTH = PAD_WIDTH / 2;
var HALF_PAD_HEIGHT = PAD_HEIGHT / 2;

var canvas = document.getElementById("frame");
var ctx = canvas.getContext("2d");
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

// draw ball
var ball_pos = [(WIDTH / 2), (HEIGHT / 2)]; 
ctx.beginPath();
ctx.arc(BALL_RADIUS, ball_pos[0], ball_pos[1], 0, 2*Math.PI);
ctx.stroke();

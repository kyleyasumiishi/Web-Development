

// Global variables
var WIDTH = 800;
var HEIGHT = 600;
var score = 0;
var lives = 3;
var time = 0;
var started = false;

class ImageInfo {
    constructor(center, size, radius, lifespan, animated) {
        this.center = center;
        this.size = size;
        if (radius == undefined) {
            this.radius = 0;
        } else {
            this.radius = radius;
        }
        if (lifespan == undefined) {
            this.lifespan = null;
        } else {
            this.lifespan - lifespan;
        }
        if (animated == undefined) {
            this.animated = false;
        } else {
            this.animated = animated;
        }
    }
    // Getters
    get_center() {
        return this.center;
    }
    get_size() {
        return this.size;
    }
    get_radius() {
        return this.radius;
    }
    get_lifespan() {
        return this.lifespan;
    }
    get_animated() {
        return this.animated;
    }
}

// Art assets created by Kim Lathrop

// Debris image
var debris_info = new ImageInfo([320, 240], [640, 480]);
// var debris_image = document.getElementById("debris");

// Nebula image
var nebula_info = new ImageInfo([400, 300], [800, 600]);

// Splash image
var splash_info = new ImageInfo([200, 150], [400, 300]);
// var splash_image = document.getElementById("splash");

// Ship image
var ship_info = new ImageInfo([45, 45], [90, 90], 35);
// var ship_image = document.getElementById("ship");

// Missile image
var missile_info = new ImageInfo([5, 5], [10, 10], 3, 50);
// var missile_image = document.getElementById("missile");

// Asteroid image
var asteroid_info = new ImageInfo([45, 45], [90, 90], 40);
// var asteroid_image = document.getElementById("asteroid");

// Explosion image
var explosion_info = new ImageInfo([64, 64], [128, 128], 17, 24, true);
// var explosion_image = document.getElementById("explosion");

//////////////////////////////////////////////////////////////////////////////////////

// Draw canvas when page loads

function load_canvas() {
    setInterval(function() {draw()}, 10);

}

// Helper functions to handle transformations
function angle_to_vector(ang) {
    return [Math.cos(ang), Math.sin(ang)];
}

function dist(p, q) {
    return Math.sqrt((p[0] - q[0])**2 + 2+(p[1] - q[1])**2);
}

// Ship class
class Ship {
    constructor(pos, vel, angle, info) {
        this.pos = [pos[0], pos[1]];
        this.vel = [vel[0], vel[1]];
        this.thrust = false;
        this.angle = angle;
        this.angle_vel = 0;
        this.image_size = info.get_size();
        this.radius = info.get_radius();
        this.info = info;
    }
    get_position() {
        return this.pos;
    }
    get_radius() {
        return this.radius;
    }
    draw(img, context) {
        context.save();
        context.translate(this.pos[0] + this.image_size[0] / 2, this.pos[1] + this.image_size[1] / 2);
        context.rotate(this.angle);
        if (this.thrust) {
            // context.drawImage(img, this.image_size[0], 0, this.image_size[0], this.image_size[1], this.pos[0], this.pos[1], this.image_size[0], this.image_size[1]);
            context.drawImage(img, this.image_size[0], 0, this.image_size[0], this.image_size[1], -this.image_size[0] / 2, -this.image_size[1] / 2, this.image_size[0], this.image_size[1]);
        } else {
            // context.drawImage(img, 0, 0, this.image_size[0], this.image_size[1], this.pos[0], this.pos[1], this.image_size[0], this.image_size[1]);
            context.drawImage(img, 0, 0, this.image_size[0], this.image_size[1], -this.image_size[0] / 2, -this.image_size[1] / 2, this.image_size[0], this.image_size[1]);
        }
        context.restore();
    }
    update() {
        // Position update
        if (this.pos[0] + this.vel[0] < 0) { 
            this.pos[0] += WIDTH;
        } else {
            this.pos[0] = (this.pos[0] + this.vel[0]) % WIDTH;
        }
        if (this.pos[1] + this.vel[1] < 0) {
            this.pos[1] += HEIGHT;
        } else {
            this.pos[1] = (this.pos[1] + this.vel[1]) % HEIGHT;
         }




        // this.pos[0] = (this.pos[0] + this.vel[0]) % WIDTH;
        // this.pos[1] = (this.pos[1] + this.vel[1]) % HEIGHT;

        // Friction update
        let c = 0.03;
        this.vel[0] *= (1 - c);
        this.vel[1] *= (1 - c);

        // Thrust update
        let forward = angle_to_vector(this.angle);
        if (this.thrust) {
            this.vel[0] += forward[0] * 0.25;
            this.vel[1] += forward[1] * 0.25;
        } 

        // Ship orientation update
        this.angle += this.angle_vel;
    }
}


var my_ship = new Ship([(WIDTH / 2) - (45 / 2), (HEIGHT / 2) - (45 / 2)], [0, 0], 0, ship_info);


function draw() {
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");
    
    // Animate background
    time++;
    let wtime = (time / 4) % WIDTH;
    let center = debris_info.get_center();
    let size = debris_info.get_size();
    var nebula_image = document.getElementById("nebula");
    var debris_image = document.getElementById("debris");
    ctx.drawImage(nebula_image, 0, 0);
    ctx.drawImage(debris_image, 0, 0, debris_info.get_size()[0], debris_info.get_size()[1], (wtime - WIDTH / 2), 60, debris_info.get_size()[0], debris_info.get_size()[1]);
    ctx.drawImage(debris_image, 0, 0, debris_info.get_size()[0], debris_info.get_size()[1], (wtime + WIDTH / 2), 60, debris_info.get_size()[0], debris_info.get_size()[1]);

    // Draw lives and scores
    ctx.font = "25px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Lives", (WIDTH * 0.05), (HEIGHT * 0.08));
    ctx.fillText(lives.toString(), (WIDTH * 0.05), (HEIGHT * 0.12));
    ctx.fillText("Score", (WIDTH * 0.88), (HEIGHT * 0.08));
    ctx.fillText(score.toString(), (WIDTH * 0.88), (HEIGHT * 0.12));

    // Draw ship
    var ship_image = document.getElementById("ship");
    my_ship.draw(ship_image, ctx);

    if (started) {
        my_ship.update();
    } else {
        var splash_image = document.getElementById("splash");
        ctx.drawImage(splash_image, 0, 0, splash_info.get_size()[0], splash_info.get_size()[1], 200, 150, splash_info.get_size()[0], splash_info.get_size()[1]);
    }  
}



// Initialize mouse and keyboard handlers

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);
document.addEventListener("click", click);

var keys = {
    up: false,
    down: false,
    left: false,
    right: false,
    space: false
};

function keydown(event) {
    switch(event.key) {
        case "ArrowUp":
            keys.up = true;
            break;
        case "ArrowDown":
            keys.down = true;
            break;
        case "ArrowLeft":
            keys.left = true;
            break;
        case "ArrowRight":
            keys.right = true;
            break;
        case " ":
            keys.space = true;
            break;
    }
    move_handler();
}

function keyup(event) {
    switch(event.key) {
        case "ArrowUp":
        keys.up = false;
        break;
    case "ArrowDown":
        keys.down = false;
        break;
    case "ArrowLeft":
        keys.left = false;
        break;
    case "ArrowRight":
        keys.right = false;
        break;
    case " ":
        keys.space = false;
        break;
    }
    move_handler();
}

function move_handler() {
    // left and right arrow keys
    if ((keys.left && keys.right) || (!keys.left && !keys.right)) {
        my_ship.angle_vel = 0;
    } else if (keys.left && !keys.right) {
        my_ship.angle_vel -= 0.075;
    } else if (!keys.left && keys.right) {
        my_ship.angle_vel += 0.075;
    }
    // up arrow key
    if (keys.up) {
        my_ship.thrust = true;
    } else {
        my_ship.thrust = false;
    }
    // space bar
    if (keys.space) {
        my_ship.shoot();
    }
}

function click(event) {
    // Resets UI and determines whether splash image is drawn.
    let canvas = document.getElementById("frame");
    x = event.clientX - canvas.offsetLeft;
    y = event.clientY - canvas.offsetTop;
    score = 0;
    lives = 3;
    let center = [WIDTH / 2, HEIGHT / 2];
    let size = splash_info.get_size();
    let inwidth = ((center[0] - (size[0] / 2) < x) && (x < center[0] + size[0] / 2));
    let inheight = ((center[1] - (size[1] / 2) < y) && (y < center[1] + size[1] / 2));
    // soundtrack.play();
    if (!started && inwidth && inheight) {
        started = true;
        // timer.start();
    }
}



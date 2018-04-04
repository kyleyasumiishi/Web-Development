

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
// class Ship {
//     constructor(pos, vel, angle, image, info) {
//         this.pos = [pos[0], pos[1]];
//         this.vel = [vel[0], vel[1]];
//         this.thrust = false;
//         this.angle = angle;
//         this.angle_vel = 0;
//         this.image = image;
//         this.image_center = info.get_center();
//         this.radius = info.get_radius();
//         this.info = info;
//     }
//     get_position() {
//         return this.pos;
//     }
//     get_radius() {
//         return this.radius;
//     }
//     draw(canvas) {
//         if (this.thrust) {
//             let thrust_image_center = (this.info.center[0] + this.info.size[0], this.info.center[1]);
//             ////////////
//         }
//     }
// }


// function draw() {
//     var canvas = document.getElementById("frame");
//     var ctx = canvas.getContext("2d");

//     var nebula_image = new Image();
//     nebula_image.src = "..images/nebula_blue.png"
//     nebula_image.addEventListener("load", function() {ctx.drawImage(nebula_image), 0, 0}, false);

    // Animate background
  // ctx.drawImage(nebula_image, 0, 0);
// }


var canvas = document.getElementById("frame");
var ctx = canvas.getContext("2d");

function doFirst() {
    var img = new Image();
    img.onload = function() {ctx.drawImage(img, 0, 0)}
    img.src = "../images/nebula_blue.png"
}


doFirst();


function draw() {
    var canvas = document.getElementById("frame");
    var ctx = canvas.getContext("2d");
    ctx.fillText("Hello", 20, 20)

    var nebula_image = new Image();
    nebula_image.onload = ctx.drawImage(nebula_image, 0, 0);
    nebula_image.src = "images/nebula_blue.png";

}

/*
RiceRocks (clone of Asteroids)

By: Kyle Yasumiishi
Last Updated: 4/5/2018
*/

// Global variables
var WIDTH = 800;
var HEIGHT = 600;
var score = 0;
var lives = 3;
var time = 0;
var started = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sounds and Images

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
            this.lifespan = Infinity;
        } else {
            this.lifespan = lifespan;
        }
        if (animated == undefined) {
            this.animated = false;
        } else {
            this.animated = animated;
        }
    }
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

// Art assets created by Kim Lathrop.
var debris_info = new ImageInfo([320, 240], [640, 480]);
var nebula_info = new ImageInfo([400, 300], [800, 600]);
var splash_info = new ImageInfo([200, 150], [400, 300]);
var ship_info = new ImageInfo([45, 45], [90, 90], 35);
var missile_info = new ImageInfo([5, 5], [10, 10], 3, 50);
var asteroid_info = new ImageInfo([45, 45], [90, 90], 40);
var explosion_info = new ImageInfo([64, 64], [128, 128], 17, 24, true);

// Missile Sound
// "Laser Shot Silenced" by bubaproducer is licensed under CC BY 3.0. URL: https://freesound.org/s/151022/
var missile_sound = new Audio();
missile_sound.src = "../RiceRocks/sounds/missile_sound.wav";

// Explosion Sound
// "Explosion" by FlashTrauma is licensed under CC0 1.0. URL: https://freesound.org/s/398283/ 
var explosion_sound = new Audio();
explosion_sound.src = "../RiceRocks/sounds/explosion.wav";

// Ship Thrust Sound
// "explosion_012.mp3" by dogfishkid is licensed under CC BY 3.0. URL: https://freesound.org/s/399303/
var thrust_sound = new Audio();
thrust_sound.src = "../RiceRocks/sounds/ship_thrust.mp3";

// Soundtrack 
// "Space Hanger" by MSFX is licensed under CC0 1.0. URL: https://freesound.org/s/401130/
var soundtrack = new Audio();
soundtrack.src = "../RiceRocks/sounds/soundtrack.wav";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Audio functions

function play_sound(audio) {
    audio.play();
}

function stop_sound(audio) {
    audio.pause();
    audio.currentTime = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Draw canvas when page loads

function load_canvas() {
    setInterval(function() {draw()}, 10);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Helper functions to handle transformations

function angle_to_vector(ang) {
    return [Math.cos(ang), Math.sin(ang)];
}

function dist(p, q) {
    return Math.sqrt((p[0] - q[0])**2 + 2+(p[1] - q[1])**2);
}

function process_sprite_group(context, group, img) {
    let remove_set = new Set();
    for (let s of group) {
        s.update();
        s.draw(img, context);
        if (s.age > s.lifespan) {
            remove_set.add(s);
        }
    }
    for (let s of remove_set) {
        if (group.has(s)) {
            group.delete(s);
        }
    }
}

function group_collide(group, other_object) {
    let remove_set = new Set();
    for (let s of group) {
        if (s.collide(other_object)) {
            var explosion_image = document.getElementById("explosion");
            let explosion_sprite = new Sprite(s.get_position(), [0, 0], 0, 0, explosion_image, explosion_info, explosion_sound);
            explosion_group.add(explosion_sprite);
            remove_set.add(s);
            group.delete(s);
            return true;
        }
    }
}

function group_group_collide(group1, group2) {
    let remove_set = new Set();
    for (let s of group1) {
        if (group_collide(group2, s)) {
            score += 5;
            remove_set.add(s);
            group1.delete(s);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Ship and Sprite Classes

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
        context.translate(this.pos[0], this.pos[1]);
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

    shoot() {
        // Stop missile sound
        stop_sound(missile_sound);

        // Initialize a missile
        var missile_image = document.getElementById("missile");
        let a_missile = new Sprite([2 * WIDTH / 3, 2 * HEIGHT / 3], [-1, 1], 0, 0, missile_image, missile_info);

        // a_missile position update
        a_missile.pos[0] = this.pos[0] + (this.radius * Math.cos(this.angle));
        a_missile.pos[1] = this.pos[1] + (this.radius * Math.sin(this.angle));

        // a_missile velocity update
        a_missile.vel[0] = this.vel[0] + angle_to_vector(this.angle)[0] * 5;
        a_missile.vel[1] = this.vel[1] + angle_to_vector(this.angle)[1] * 5;

        // Play missile sound
        play_sound(missile_sound);

        // Add a_missile to missile_group
        missile_group.add(a_missile);
    }

    update() {
        // Position update
        if (this.pos[0] + this.vel[0] < 0) { 
            this.pos[0] = this.pos[0] + this.vel[0] + WIDTH;
        } else {
            this.pos[0] = (this.pos[0] + this.vel[0]) % WIDTH;
        }
        if (this.pos[1] + this.vel[1] < 0) {
            this.pos[1] = this.pos[1] + this.vel[1] + HEIGHT;
        } else {
            this.pos[1] = (this.pos[1] + this.vel[1]) % HEIGHT;
         }
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

class Sprite {
    constructor(pos, vel, ang, ang_vel, image, info, sound) { 
        this.pos = [pos[0], pos[1]];
        this.vel = [vel[0], vel[1]];
        this.angle = ang;
        this.angle_vel = ang_vel;
        this.image = image;
        this.image_center = info.get_center();
        this.image_size = info.get_size();
        this.radius = info.get_radius();
        this.lifespan = info.get_lifespan();
        this.animated = info.get_animated();
        this.age = 0;
        if (sound !== null && sound !== undefined) {
            stop_sound(sound);
            play_sound(sound);
        }
    }
    get_position() {
        return this.pos;
    }
    get_radius() {
        return this.radius;
    }
    // Return true if collision, else false.
    collide(other_object) {
        let d = dist(this.get_position(), other_object.get_position());
        if (d > (this.get_radius() + other_object.get_radius())) {
            return false;
        } else {
            return true;
        }
    }
    draw(img, context) {
        context.save();
        if (this.animated) {
            let explosion_index = Math.floor(this.age % this.lifespan);
            context.translate(this.pos[0], this.pos[1]);
            context.rotate(this.angle);
            context.drawImage(img, this.image_size[0] * explosion_index, 0, this.image_size[0], this.image_size[1], -1 * (this.image_size[0] / 2), -1 * (this.image_size[1] / 2), this.image_size[0], this.image_size[1]);
        } else {
            context.translate(this.pos[0], this.pos[1]);
            context.rotate(this.angle);
            context.drawImage(img, 0, 0, this.image_size[0], this.image_size[1], -this.image_size[0] / 2, -this.image_size[1] / 2, this.image_size[0], this.image_size[1]);
        }
        context.restore();
    }
    update() {
        this.angle += this.angle_vel;
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
        // Increment age every time update is called
        this.age += 0.6;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Event Handlers

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
        // Update ship position
        my_ship.update();

        // draw and update rock_group and missile_group
        var asteroid_image = document.getElementById("asteroid");
        var missile_image = document.getElementById("missile");
        var explosion_image = document.getElementById("explosion");
        process_sprite_group(ctx, asteroid_group, asteroid_image);
        process_sprite_group(ctx, missile_group, missile_image);
        group_group_collide(missile_group, asteroid_group);
        process_sprite_group(ctx, explosion_group, explosion_image);

        // if ship collides with asteroid, remove asteroid from asteroid_group and decrease lives
        if (group_collide(asteroid_group, my_ship)) {
            lives -= 1;

            // restart game when lives run out
            if (lives < 1) {
                time = 0;
                lives = 0;
                asteroid_group.clear();
                missile_group.clear();
                explosion_group.clear();
                my_ship.pos = [WIDTH / 2, HEIGHT / 2];
                stop_sound(soundtrack);
                started = false;
                clearInterval(interval);
                clearInterval(sound_interval);
            }
        }


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
            event.preventDefault();
            break;
        case "ArrowDown":
            keys.down = true;
            event.preventDefault();
            break;
        case "ArrowLeft":
            keys.left = true;
            event.preventDefault();
            break;
        case "ArrowRight":
            keys.right = true;
            event.preventDefault();
            break;
        case " ":
            keys.space = true;
            event.preventDefault();
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
        play_sound(thrust_sound);
    } else {
        my_ship.thrust = false;
        stop_sound(thrust_sound);
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
    let center = [WIDTH / 2, HEIGHT / 2];
    let size = splash_info.get_size();
    let inwidth = ((center[0] - (size[0] / 2) < x) && (x < center[0] + size[0] / 2));
    let inheight = ((center[1] - (size[1] / 2) < y) && (y < center[1] + size[1] / 2));
    if (!started && inwidth && inheight) {
        score = 0;
        lives = 3;
        started = true;
        interval = setInterval(function() {timer(); rock_spawner()}, 1000);
        sound_interval = setInterval(function() {play_sound(soundtrack);}, 60000);
    } else if (started && x >= 0 && x <= WIDTH && y >= 0 && y <= HEIGHT) {
        alert("Game Paused. Click OK to resume.");
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// rock_spawner and timer functions

function rock_spawner() {
    // Initialize rock sprite with random position on canvas and random spin direction
    var asteroid_image = document.getElementById("asteroid");
    let asteroid = new Sprite([WIDTH / 3, HEIGHT / 3], [.3, .4], 0, .1, asteroid_image, asteroid_info);
    asteroid.pos[0] = Math.floor((Math.random() * WIDTH)); 
    asteroid.pos[1] = Math.floor((Math.random() * HEIGHT));
    asteroid.vel[0] = Math.floor((Math.random() * 10)) / 10.0;
    asteroid.vel[1] = Math.floor((Math.random() * 10)) / 10.0;
    asteroid.angle_vel = Math.floor((Math.random() * 10)) / 100.0;

    // Random spinning direction of asteroid
    var spin_dir = ["clockwise", "counter"];
    let random_spin_dir = spin_dir[Math.floor(Math.random() * 2)];
    if (random_spin_dir == "counter") {
        asteroid.angle_vel *= -1;
    }

    // Add asteroid to asteroid_group if there's 12 or less rocks on canvas and it doesn't automatically collide with my_ship.
    if ((asteroid_group.size <= 10) && ((dist(asteroid.get_position(), my_ship.get_position())) > (asteroid.get_radius() + 1.2 * my_ship.get_radius()))) {
        asteroid_group.add(asteroid);
    }
}

function timer() {
    time++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize ship and sprites

var my_ship = new Ship([WIDTH / 2, HEIGHT / 2], [0, 0], 0, ship_info);
var asteroid_group = new Set();
var missile_group = new Set();
var explosion_group = new Set();


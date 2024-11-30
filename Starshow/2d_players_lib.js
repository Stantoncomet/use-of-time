// Canvas Setup
let canvas_ele = document.createElement('canvas');
canvas_ele.id = "gamefield";
canvas_ele.width = 512;
canvas_ele.height = 512;
document.body.appendChild(canvas_ele);
/**
 * @type {HTMLCanvasElement}
 */
var canvas = document.getElementById('gamefield');
var ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;



// Display

const FPS = 60;
var CURRENT_TIME = 0;

/**
 * 
 * @param {TimerHandler} loop_fn 
 * @param {number} delay 
 */
function setGameLoop(loop_fn, delay=FPS) {
    setInterval(() => {
        loop_fn();
        CURRENT_TIME++;
    }, delay);
}


// Keyboard events

var down_keys = [];

document.addEventListener('keydown', e => {
    if (down_keys.includes(e.key)) return;
    down_keys.push(e.key);
})
document.addEventListener('keyup', e => {
    down_keys = down_keys.filter(k => k != e.key);
})

function getDownKeys() {
    return down_keys;
}

/**
 * 
 */
function keyIsPressed(key) {
    if (down_keys.includes(key)) return true;
    else return false;
}

// Simple drawings

/**
 * Dras a rectangle with top-left position and dimentions.
 */
function drawRect(x, y, w, h, color="red", fill=true) {
    ctx.fillStyle = ctx.strokeStyle = color;
    
    if (fill)
        ctx.fillRect(x, y, w, h);
    else
        ctx.strokeRect(x, y, w, h);
}

/**
 * Draws a rectangle with top-left and bottom-right coordinates.
 */
function drawABSRect(x1, y1, x2, y2, color) {
    drawRect(x1, y1, x2-x1, y2-y1, color);
}

/**
 * 
 * @param {String} color CSS color, "rgb(0,1,2)", "red", etc.
 */
function drawBackground(color="gray") {
    drawRect(0, 0, WIDTH, HEIGHT, color);
}

function drawCircle(x, y, r, color="red", fill=true) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, r, r, Math.PI/4, 0, 2*Math.PI);
    if (fill)
        ctx.fill();
    else
        ctx.stroke();
} 

// Other drawings

/**
 * Writes text to a position. Orientation: bottom-left;
 */
function putText(x, y, text, color="blue", px_size=10, font_name="Arial") {
    ctx.font = `${px_size}px ${font_name}`;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function putImage(src, x, y, w, h) {
    let img = new Image();
    img.src = src;
    ctx.drawImage(img, x, y, w, h);
}

// Entity

class Block {
    constructor (x, y, width=32, height=32, color_a="red", color_b="blue") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hw = width/2; //half-width
        this.hh = height/2; //half-height
        this.texture = null;
        this.color_a = color_a;
        this.color_b = color_b;
    }
    setTexture(texture_path) {
        this.texture = texture_path;
    }
    draw(outline=false) {
        if (this.texture) {
            putImage(this.texture, this.x-this.hw, this.y-this.hh, this.width, this.height);
        } else {
            drawRect(this.x-this.hw, this.y-this.hh, this.width, this.height, this.color_a, true);
        }
        if (outline) {
            drawRect(this.x-this.hw, this.y-this.hh, this.width, this.height, this.color_b, false);
            drawCircle(this.x, this.y, 2, this.color_b);
        }
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Entity extends Block {
    constructor (init_x, init_y, width, height, color_a, color_b) {
        super(init_x, init_y, width, height, color_a, color_b);
        this.vel = {
            x: 0,
            y: 0
        }
    }
    move(dx, dy) {
        this.x+=dx;
        this.y+=dy;
        
        if (this.x+this.hw > WIDTH || this.x-this.hw < 0) {
            this.x-=dx;
        }
        if (this.y+this.hh > HEIGHT || this.y-this.hh < 0) {
            this.y-=dy;
        }

    }
}

class Player extends Entity {

    checkWalls() {

    }

}

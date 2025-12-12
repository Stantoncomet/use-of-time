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

/**
 * Constants/not to be changed during runtime by external scripts
 */

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const c_TRANSPARENT = 'rgba(0,0,0,0)';

const FPS = 30;
const TPS = 20;
var CURRENT_TIME = 0;

var DOWN_KEYS = [];
var MOUSEDOWN = false;
var MOUSEPOS = {
    x: 0,
    y: 0
}


/**
 * Config stuff
 */

/**
 * Appends the gamefield to a custom html container
 * @param {string} container_id 
 */
function setGameFieldContainer(container_id) {
    document.getElementById(container_id).appendChild(canvas_ele);
}



/**
 * Loops :)
 */

/**
 * 
 * @param {Function} loop_fn 
 * @param {number} delay 
 */
function setLogicLoop(loop_fn, delay=1000/TPS) {
    setInterval(() => {
        loop_fn();
        CURRENT_TIME++;
    }, delay);
}

/**
 * 
 * @param {Function} loop_fn 
 * @param {number} delay 
 */
function setDrawLoop(loop_fn, delay=1000/FPS) {
    setInterval(() => {
        loop_fn();
    }, delay);
}



/**
 * Keyboard and mouse events
 */

document.addEventListener('keydown', e => {
    if (DOWN_KEYS.includes(e.key)) return;
    DOWN_KEYS.push(e.key);
})
document.addEventListener('keyup', e => {
    DOWN_KEYS = DOWN_KEYS.filter(k => k != e.key);
})

/**
 * Returns list of pressed keys
 * @returns 
 */
function getDownKeys() {
    return DOWN_KEYS;
}

function keyIsPressed(key) {
    if (DOWN_KEYS.includes(key)) return true;
    else return false;
}

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    MOUSEPOS.x = x;
    MOUSEPOS.y = y;
});

canvas.addEventListener('mousedown', e => {
    MOUSEDOWN = true;
})
canvas.addEventListener('mouseup', e => {
    MOUSEDOWN = false;
})
canvas.addEventListener('click', e => {
    onClick(MOUSEPOS);
})

function onClick() {
    console.log('This code was ran because you clicked your mouse! To use this functionality yourself, create an "onClick()" function in your own script with your own code.');
}


/**
 * Drawing helpers
 */

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

function drawLine(x1, y1, x2, y2, color="red", weight=1) {
    ctx.stroke
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



/**
 * Object constructors and things
 */

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

    getN() {
        return this.y-this.hh;
    }
    getE() {
        return this.x+this.hw;
    }
    getS() {
        return this.y+this.hh;
    }
    getW() {
        return this.x-this.hw;
    }

    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    resizeBy(width, height = 'auto') {
        if (height == 'auto') height = width;
        this.x -= width/2;
        this.y -= height/2;
        this.width += width;
        this.height += height;
        this.hw = width/2; //half-width
        this.hh = height/2; //half-height
    }
    
    /**
     * 
     * @param {number} width 
     * @param {number} height 
     */
    resizeTo(width, height = 'auto') {
        if (height == 'auto') height = width;
        this.x -= (width-this.width)/2;
        this.y -= (height-this.height)/2;
        this.width = width;
        this.height = height;
        this.hw = width/2; //half-width
        this.hh = height/2; //half-height
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

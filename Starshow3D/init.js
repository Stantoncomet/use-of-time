/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById('screen');
let ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height


ctx.fillRect(0,0,canvas.width,canvas.height);

let lines = 30;
for (let i = 0; i < lines; i++) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(i*WIDTH/lines, 0, .3, HEIGHT);
}
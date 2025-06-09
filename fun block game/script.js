/**
 * @type {HTMLCanvasElement}
 */
let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");

let intervs = []

function drawCircle() {
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;

    let r = Math.random()*255;
    let g = Math.random()*255;
    let b = Math.random()*255;
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;

    ctx.beginPath();
    ctx.ellipse(x, y, 50, 50, 0, 0, Math.PI*2);
    ctx.fill()
}


function randomPointsStart() {
    intervs.push(setInterval(drawCircle, 10));
}

function randomPointsStop() {
    intervs.forEach(i => {
        clearInterval(i)
    })
}
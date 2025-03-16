var Cube = new Block(WIDTH/2, HEIGHT/2, 10, 10);

var Ripples = [];



function logicLoop() {
    Cube.x = MOUSEPOS.x;
    Cube.y = MOUSEPOS.y;

    if (MOUSEDOWN) Cube.resizeTo(40);
    //if (!MOUSEDOWN) Cube.resizeTo(10);

    Ripples.forEach(r => {
        r.resizeBy(1);
    })

}

function drawLoop() {
    drawBackground('black')

    Ripples.forEach(r => {
        r.draw(true);
    })
    Cube.draw();
}

function onClick(m) {
    Ripples.push(new Block(m.x, m.y, 10, 10, 'black', 'white'));
    
}

setLogicLoop(logicLoop);
setDrawLoop(drawLoop);
let Dude = new Player(WIDTH/2, HEIGHT/2, 10, 30);
let P_SPEED = 2;

let Box1 = new Entity(100, 100, 150, 100, "purple", "black");
let Light1 = new Block(25, 25, 40, 40, "pink");
let Light2 = new Block(80, 25, 40, 40, "pink");


function isTouchingBox() {
    // COLLISIONS
    if ( Dude.getE() > Box1.getW() &&
         Dude.getW() < Box1.getE() &&
         Dude.getS() > Box1.getN() &&
         Dude.getN() < Box1.getS()
       ) {
        Light1.color_a = "green";
        if ( Dude.getN() < Box1.getS() &&
             Dude.getS() > Box1.getS()
           ) {
            Light1.color_b = "orange";
        }
        if ( Dude.getW() < Box1.getE() &&
             Dude.getE() > Box1.getE()
           ) {
            Light1.color_b = "blue";
        }
        
        return true;
    } else {
        Light1.color_a = "pink";
        return false
    }
}

function isInBox() {
    // COLLISIONS
    if ( Dude.getE() < Box1.getE() &&
         Dude.getW() > Box1.getW() &&
         Dude.getS() < Box1.getS() &&
         Dude.getN() > Box1.getN()
       ) {
        Light2.color_a = "green";
        return true;
    } else {
        Light2.color_a = "pink";
        return false
    }
}

function doBasicControls() {
    // CONTROLS
    if (keyIsPressed("w") || keyIsPressed("ArrowUp")) {
        Dude.move(0, -P_SPEED);
    }
    if (keyIsPressed("a") || keyIsPressed("ArrowLeft")) {
        Dude.move(-P_SPEED, 0);
    }
    if (keyIsPressed("s") || keyIsPressed("ArrowDown")) {
        Dude.move(0, P_SPEED);
    }
    if (keyIsPressed("d") || keyIsPressed("ArrowRight")) {
        Dude.move(P_SPEED, 0);
    }
}



function logicLoop() {
    // if (!isInBox()) {
    //     doBasicControls();
    // }
    isTouchingBox();
    isInBox();
    doBasicControls();

    //P_SPEED = Math.abs(Math.sin(CURRENT_TIME/30)*5);
    //Box1.move(Math.sin(CURRENT_TIME/30)*5, Math.sin(CURRENT_TIME/30)*5)
}

function drawLoop() {
    drawBackground("bisque");
    Light1.draw(true);
    Light2.draw(false);
    Box1.draw(true);
    Dude.draw(true);
    
    putText(0, HEIGHT, Math.sin(CURRENT_TIME/30)*5)
}

setLogicLoop(logicLoop);
setDrawLoop(drawLoop);
var Ship = new Player(WIDTH/2, HEIGHT-50, 32, 64);
Ship.setTexture('./ship.png');
const SHIP_SPEED = 5;
let ship_offset = 0;
let ship_init_y = Ship.y;

// let Box1 = new Block(50, 50, 30, 30);
// Box1.setTexture('./box.png');

let Bullets = [];
const FIRE_SPEED = 10;
const FIRE_DELAY = 5;

let Aliens = [];
let lvl = 0;

const ALIEN_LOADOUT_1 = [
    new Entity(40, 40, 32, 32, "green"),
    new Entity(80, 40, 32, 32, "green"),
    new Entity(120, 40, 32, 32, "green"),
    new Entity(160, 40, 32, 32, "green"),
    new Entity(40, 80, 32, 32, "green"),
    new Entity(80, 80, 32, 32, "green"),
    new Entity(120, 80, 32, 32, "green"),
    new Entity(160, 80, 32, 32, "green")
]
Aliens = ALIEN_LOADOUT_1;


let Stars = [];
for (let i = 0; i < 100; i++) {
    Stars.push([Math.random()*WIDTH, Math.random()*HEIGHT, Math.random()*5, 0.2]);
}


function increaseLevel() {
    lvl++;

    Aliens
}




function logicLoop() {
    // CONTROLS
    if (keyIsPressed("a") || keyIsPressed("ArrowLeft")) {
        Ship.move(-SHIP_SPEED, 0);
    }
    if (keyIsPressed("d") || keyIsPressed("ArrowRight")) {
        Ship.move(SHIP_SPEED, 0);
    }

    if (keyIsPressed("w") || keyIsPressed("ArrowUp")) {
        if (CURRENT_TIME%FIRE_DELAY == 0) {
            Bullets.push(new Entity(Ship.x, Ship.y-Ship.hh+10, 4, 8, "white"));
        }
    }

    // if (CURRENT_TIME%(FPS/7) > FPS/14) {
    //     Ship.y++;
    // }
    // if (CURRENT_TIME%(FPS/7) < FPS/14) {
    //     Ship.y--;
    // }
    ship_offset = Math.sin(CURRENT_TIME/2)*2;
    Ship.y = ship_init_y+ship_offset;


    // BULLETS
    Bullets.forEach((b, i) => {
        b.y-=FIRE_SPEED
        if (b.y+b.hh < 0) {
            Bullets.splice(i, 1);
        }
    })

    // ALIENS
    if (Aliens.length == 0) {
        increaseLevel();
    }

    Aliens.forEach(a => {
        if (Bullets.length == 0) return;
        let hit = false;
        Bullets.forEach(b => {
            if ( b.x > a.x-a.hh &&
                 b.x < a.x+a.hh &&
                 b.y < a.y+a.hh &&
                 b.y > a.y-a.hh
              ) {
               hit = true;
           }
        })
        if (hit) {
            a.color_a = "red";
        } else {
            a.color_a = "green";
        }
    })
}

function drawLoop() {
    drawBackground("black");


    // Stars
    Stars.forEach(s => {
        if (CURRENT_TIME%(Math.floor(Math.random()*60)) == 0) {
            s[3]+=(Math.random()*0.2)-0.1;
        }
        drawCircle(s[0], s[1], s[2], `rgb(255,255,255,${s[3]})`);
    })


    putText(0, HEIGHT, "Pressed Keys: "+getDownKeys());

    //Box1.draw();

    // Aliens
    Aliens.forEach(a => {
        a.draw();
    })

    // Player
    Ship.draw();
    Bullets.forEach(b => {
        b.draw();
    })


}


setLogicLoop(logicLoop);
setDrawLoop(drawLoop);
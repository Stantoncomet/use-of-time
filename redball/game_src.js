
/*
TODO
- bounds detection?
- button/trigger
- limited number of direction tiles
- select tool
  - delete
  - copy/paste

*/

let editor_mode = true

let level_complete = false;
let current_level = 1;

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

let current_block = "+x"

let gx = -1
let gy = -1

let MOUSE = {
	x: 0,
	y: 0
}

let offset = {
	x: 0,
	y: 0
}

const SPEED = 0.25

let u = 54

let saved_vel = {x:0, y:0}

let is_reset = true
let tick_delay = 50
let first_canvas = true

let mouse_down = false

let c_background = "#351E29"
let c_gridlines = "#ffffff"

// Speed button
function changeTickDelay(delta, e) {
	tick_delay += delta
	document.getElementById("tick-display").innerText = `Tick Rate: ${tick_delay}ms`

	e.blur()
}


// Info sidebar
function toggleInfo(e) {
	info_div = document.getElementById("info")

	if (info_div.style.visibility == "visible")
		info_div.style.visibility = "hidden";
	else
		info_div.style.visibility = "visible";

	e.blur()
}

class Block {
	constructor(x, y, type="") {
		this.x = x;
		this.y = y;
		this.type = type;
	}

	color() {
		switch (this.type) {
			case "left": {
				return "rgba(255, 255, 0, 0.5)"
				break;
			}
			case "+x": {
				return ">#6DD3CE"
				break;
			}
			case "-x": {
				return "<#C8E9A0"
				break;
			}
			case "+y": {
				return "v#F7A278"
				break;
			}
			case "-y": {
				return "^#A13D63"
				break;
      }
      case "wall": {
        return "=#54414E"
        break;
      }
      case "spawn": {
        return "*#F61067"
        break;
      }
      case "goal": {
        return "+#F61067"
        break;
      }
      case "trigger": {
        return "+#41D3BD"
        break;
      }
      case "closeddoor": {
        return "I#E85F5C"
        break;
      }
      case "opendoor": {
        return ":#ACF39D"
        break;
      }
			default: {
				return "-rgba(0,0,0,0)"
			}
		}
	}

	draw() {
		drawSquare(this.x*u, this.y*u, u, this.color().slice(1))
		ctx.fillStyle = "#111"
		ctx.font = `${u}px Arial`
		ctx.fillText(this.color()[0], (this.x+offset.x)*u+u/4, (this.y+offset.y)*u+u*.8)
	}
}

let objects = []
let saved_objects = []

let ball = {
  sx: 5,
  sy: 5,
	x: 100,
	y: 100,
	vx: 0,
	vy: 0,

	draw: function () {
		drawCircle((this.x+offset.x)*u, (this.y+offset.y)*u)
	},
	move: function() {
		this.x+=this.vx
		this.y+=this.vy
	},

	turnLeft: function() {
		if (this.vy > 0) {
			this.vx = SPEED
			this.vy = 0
		} else if (this.vy < 0) {
			this.vx = -SPEED
			this.vy = 0
		} else if (this.vx > 0) {
			this.vy = -SPEED
			this.vx = 0
		} else if (this.vx < 0) {
			this.vy = SPEED
			this.vx = 0
		}
	},
	turnRight: function() {
		if (this.vy > 0) {
			this.vx = -SPEED
			this.vy = 0
		} else if (this.vy < 0) {
			this.vx = SPEED
			this.vy = 0
		} else if (this.vx > 0) {
			this.vy = SPEED
			this.vx = 0
		} else if (this.vx < 0) {
			this.vy = -SPEED
			this.vx = 0
		}
	}
}

document.addEventListener("DOMContentLoaded", () => {
	setInterval(gameloop, 10)
	setTimeout(logicLoop, tick_delay)
});




function gameloop() {
	// background
  ctx.fillStyle = c_background;
	ctx.fillRect(0,0,1080,520)

	// grid
	for (let i=0; i<1080/u; i++) {
    ctx.strokeStyle = c_gridlines;
		if (!is_reset)
			ctx.strokeStyle = "#faa"
		ctx.lineWidth = 1

		ctx.beginPath()
		ctx.moveTo(i*u, 0)
		ctx.lineTo(i*u, 520)
		ctx.stroke()

		ctx.beginPath()
		ctx.moveTo(0, i*u)
		ctx.lineTo(1080, i*u)
		ctx.stroke()
	}


	// objects
	objects.forEach(o => {
		o.draw()
	})


	// goal
  drawSquare(gx * u, gy * u, u, "#F61067")
	drawCircle(gx * u, gy * u, "#351E29", false)

	// starting pos
	drawSquare(ball.sx*u, ball.sy*u, .25*u, "#F61067")
	drawSquare(ball.sx*u, ball.sy*u+.75*u, .25*u, "#F61067")
	drawSquare(ball.sx*u+.75*u, ball.sy*u, .25*u, "#F61067")
	drawSquare(ball.sx*u+.75*u, ball.sy*u+.75*u, .25*u, "#F61067")

	ball.draw()


	// mouse object
	let sel_obj = new Block(-1, -1, current_block)
	drawSquare(MOUSE.x, MOUSE.y, u/2, sel_obj.color().slice(1), true, true)
	ctx.fillStyle = "#111"
	ctx.font = `${u/2}px Arial`
	ctx.fillText(sel_obj.color()[0], MOUSE.x-u/8, MOUSE.y+u*.2)


}

function logicLoop() {
	ball.move()
	objects.forEach(o => {
		// if on object
		if (ball.x == o.x && ball.y == o.y) {
			// do different things with different types of ojbects
			switch (o.type) {
				// turn ball left
				case "left": {
					ball.turnLeft()
					break;
				}
				case "+x": {
					o.type = "-x"
					ball.vx = SPEED
					ball.vy = 0
					break;
				}
				case "-x": {
					o.type = "+x"
					ball.vx = -SPEED
					ball.vy = 0
					break;
				}
				case "+y": {
					o.type = "-y"
					ball.vx = 0
					ball.vy = SPEED
					break;
				}
				case "-y": {
					o.type = "+y"
					ball.vx = 0
					ball.vy = -SPEED
					break;
        }
        case "closeddoor": { }
        case "wall": {
          ball.vx = 0;
          ball.vy = 0;
          break;
        }

				default: {}

      }
		// check for goal reached, since the goal isn't a real object
    } else if (ball.x == gx && ball.y == gy && !level_complete) {
      ball.vx = 0;
      ball.vy = 0;
      if (editor_mode) return;

      c_background = "#000000";
      c_gridlines = "#000000";
      is_reset = true;
      level_complete = true;

      setTimeout(() => {
        resetFeild();
        current_level++;

        level_complete = false;
        first_canvas = true;
        c_background = "#351E29";
        c_gridlines = "#ffffff";

        loadLevel("", `level${current_level}`);
      }, 1000)
		}

	})

	setTimeout(logicLoop, tick_delay)
}


function drawSquare(x, y, w=u, color="#ff0", centered=false, absolute=false) {
	if (!absolute) {
		x = x + offset.x*u
		y = y + offset.y*u
	}
	ctx.fillStyle = color
	ctx.strokeStyle = "#ccc"
	ctx.lineWidth = 2
	if (centered) {
		ctx.fillRect(x-(w/2),y-(w/2),w,w)
		ctx.strokeRect(x-(w/2),y-(w/2),w,w)
	} else {
		ctx.fillRect(x,y,w,w)
		ctx.strokeRect(x,y,w,w)
	}
}

function drawCircle(x, y, color="#F61067", absolute=true) {
	let r = u/2-2
	ctx.beginPath();
  ctx.fillStyle = color;
  if (absolute)
    ctx.arc(x+u/2, y+u/2, r, 0, 2 * Math.PI);
  else
    ctx.arc(offset.x*u+x+u/2, offset.y*u+y+u/2, r, 0, 2 * Math.PI);
  ctx.fill()
	ctx.lineWidth = 1
	ctx.strokeStyle = "#ccc"
	ctx.stroke();
}


function place() {
  if (level_complete) return;

	let ox = Math.floor(MOUSE.x/u)
	let oy = Math.floor(MOUSE.y/u)

	ox -= offset.x
  oy -= offset.y

  // ball spawn set
  if (current_block == "spawn") {
    ball.sx = ox;
    ball.sy = oy;
    return;
  }
  // goal set
  else if (current_block == "goal") {
    gx = ox;
    gy = oy;
    return;
  }

  // no replace walls or goal
  let is_wall = false
  if (!editor_mode) {
    objects.forEach(o => {
      if ((o.x == ox && o.y == oy && (o.type == "wall")) || (gx == ox && gy == oy))
        is_wall = true
    })
  }
  if (is_wall)
    return

	// remove blocks at same position
	objects.forEach((o, i) => {
		if (o.x == ox && o.y == oy)
			objects.splice(i, 1)
	})

	// eraser
	if (current_block != "erase")
    objects.push(new Block(ox, oy, current_block))


	// triggers/doors
  if (current_block == "trigger") {
    current_block = "closeddoor"
  }
}

function resetFeild() {
	// don't reset if there's no saved canvas
	if (first_canvas) return
	is_reset = true
	objects = _.cloneDeep(saved_objects)

	ball.x = 100
	ball.y = 100
	ball.vx = 0
	ball.vy = 0
}

function spawnBall() {
	first_canvas = false
	is_reset = false
	saved_objects = _.cloneDeep(objects)


	ball.x = ball.sx
	ball.y = ball.sy
	ball.vx = 0
	ball.vy = 0
}


function loadLevel(e = "", l_name = "") {
  level_name = l_name;
  if (e != "") {
    e.blur();
    level_name = document.getElementById("save-name").value;
  }


  // smth like this
	if (levels[level_name] == null) {
		document.getElementById("feedback").innerText = `No level found "${level_name}"`
		return
  }

	// get level from levels.js and load shit
	level = levels[level_name]
  objects = []
  level.objects.forEach(o => {
  	objects.push(new Block(o.x, o.y, o.type))
  })

  u = level.u
  offset = level.offset
  ball.sx = level.ball_spawn.x
  ball.sy = level.ball_spawn.y
  gx = level.goal.x
  gy = level.goal.y

	document.getElementById("feedback").innerText = `Loaded level "${level_name}"`
}

function saveLevel() {
  document.getElementById("save-name").blur()
  level_name = document.getElementById("save-name").value

  resetFeild()
	let save_objects = []
	objects.forEach(o => {
		save_objects.push(
			{
				x: o.x,
				y: o.y,
				type: o.type
			}
		)
  })

  let level = {
    u: u,
    offset: {
      x: offset.x,
      y: offset.y
    },
    ball_spawn: {
      x: ball.sx,
      y: ball.sy
    },
    goal: {
      x: gx,
      y: gy
    },
    objects: save_objects
  }

	console.log(level)

  // print canvas object to terminal to manually copy to levels.js prob

	document.getElementById("feedback").innerText = `Printed level "${level_name}" object to console`
}

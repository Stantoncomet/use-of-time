canvas.addEventListener("mousemove", e => {
	const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
	MOUSE.x = x
	MOUSE.y = y

	if (mouse_down)
		place()

});

canvas.addEventListener("mousedown", () => {
	place()
	mouse_down = true
})

canvas.addEventListener("mouseup", () => {
	mouse_down = false
})


document.addEventListener("keypress", e => {

	switch (e.key) {
		case "d": {
			current_block = "+x"
			break;
		}
		case "a": {
			current_block = "-x"
			break;
		}
		case "w": {
			current_block = "-y"
			break;
		}
		case "s": {
			current_block = "+y"
			break;
		}
		case "e": {
			current_block = "erase"
			break;
		}
		// freeze
		case "f": {
			if (ball.vx == 0 && ball.vy == 0) {
				ball.vx = saved_vel.x;
				ball.vy = saved_vel.y;
			} else {
				saved_vel.x = ball.vx;
				saved_vel.x = ball.vx;
				ball.vx = 0;
				ball.vy = 0;
			}

			break;
		}

		case " ": {
			if (is_reset)
				spawnBall()
			else {
				resetFeild()
			}
			break;
		}

    // editor tools

		// move view point
		case "W": {
			offset.y++;
			break;
		}
		case "A": {
			offset.x++;
			break;
		}
		case "S": {
			offset.y--;
			break;
		}
		case "D": {
			offset.x--;
			break;
		}

		// zoom
		case "n": {}
		case "N": {
			u -= 5
			break;
		}
		case "m": {}
		case "M": {
		  u += 5
			break;
    }

    // place ball spawn
    case "q": {
      current_block = "spawn";
      break;
    }

    // save level
    case "t": {
      saveLevel();
      break;
    }

    default: {
			return;
		}
	}
})

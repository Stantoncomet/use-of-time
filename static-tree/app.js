// fractal math stuff

let Tree = new TreeNode(WIDTH / 2, HEIGHT / 2);
let generations = 1;
let gen_delay = 50;
let line_size = 120;
let fixed_branches = 7;
// limit which generations are drawn
let DRAW_LIMIT = false;
let draw_gen_range = [0, 0];

/**
 * @param {TreeNode} node
 * @param {number} n
 */
function simpleBranch(node, n, theta_offset = Math.PI) {
  console.log("branching from", theta_offset);
  line = line_size / (generations + 1 - n);
  // line = line_size;
  // branches = 8 - n;
  branches = fixed_branches;
  for (let i = 0; i < branches; i++) {
    // console.log(n, "adding child");

    // random
    // node.addChild(
    //   node.x + rand(-line_size, line_size),
    //   node.y + rand(-line_size * 2, 0),
    // );

    // symmetry
    // theta = (i * 2 * Math.PI) / branches;
    // each line around the node gets smaller
    // line = (i * line_size) / branches;
    // console.log("theta");
    // console.log(theta);

    // overlap avoidance mk I (using theta offset)
    theta = theta_offset + (i * 2 * Math.PI) / branches;
    console.log(theta);

    // nodes are in rings around parent
    node.addChild(
      node.x + line * Math.cos(theta),
      node.y + line * Math.sin(theta),
    );
    // putText(
    //   node.children[node.children.length - 1].x,
    //   node.children[node.children.length - 1].y,
    //   Math.floor(theta * 100) / 100,
    //   "red",
    //   2,
    // );

    //
    // node.addChild(
    //   node.x + line_size * Math.cos(theta),
    //   node.y + line_size * Math.sin(theta),
    // );
  }

  // limit what generations are drawn
  if (DRAW_LIMIT && n >= draw_gen_range[0] && n <= draw_gen_range[1])
    node.drawChildLines();
  else if (!DRAW_LIMIT) node.drawChildLines();

  // if there are generations left, repeat algothrithm for children
  if (n > 0) {
    node.children.forEach((child_node) => {
      // calculate angle from parent to child
      x_diff = child_node.x - node.x;
      y_diff = child_node.y - node.y;
      child_theta = Math.atan(y_diff / x_diff);

      setTimeout(simpleBranch, gen_delay, child_node, n - 1, child_theta);
    });
  }
}

simpleBranch(Tree, generations);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function simulate() {
  drawBackground("black");
  Tree.children = [];
  simpleBranch(Tree, generations);
}

//
//
//
// Skylar what the heck is this supposed to do

// function fractal_thing(n, x, y, scale) {
//   drawCircle(x, y, 6);
//   for (let i = 0; i < n; i++) {
//     drawChild(n, (i * 2 * Math.PI) / n, scale, x, y);
//   }
// }

// let MIN_DIST = 4;
// function drawChild(n, rad, x, y, scale) {
//   if (scale >= MIN_DIST) {
//     let xNew = x + Math.cos(rad) * scale;
//     let yNew = y + Math.sin(rad) * scale;
//     drawCircle(xNew, yNew, 6); // Draws center
//     for (let i = 0; i < n; i++) {
//       if (i != n / 2) {
//         drawChild(n, (i * 2 * Math.PI) / n, xNew, yNew, scale * scale);
//       }
//     }
//   }
// }

// fractal_thing(2, WIDTH / 2, HEIGHT / 2, 80);

// fractal math stuff

let Tree = new TreeNode(WIDTH / 2, HEIGHT / 2);
let generations = 3;
let gen_delay = 250;
let line_size = 20;
let fixed_branches = 6;

/**
 * @param {TreeNode} node
 * @param {number} n
 */
function simpleBranch(node, n) {
  line = line_size;
  // line = line_size;
  // branches = 8 - n;
  branches = fixed_branches;
  for (let i = 0; i < branches; i++) {
    console.log(n, "adding child");

    // random
    // node.addChild(
    //   node.x + rand(-line_size, line_size),
    //   node.y + rand(-line_size * 2, 0),
    // );

    // symmetry
    theta = (i * 2 * Math.PI) / branches;
    // theta = ((i + 4) * 2 * Math.PI) / branches;
    // each line around the node gets smaller
    // line = (i * line_size) / branches;
    node.addChild(
      node.x + line * Math.cos(theta),
      node.y + line * Math.sin(theta),
    );

    //
    // node.addChild(
    //   node.x + line_size * Math.cos(theta),
    //   node.y + line_size * Math.sin(theta),
    // );
  }
  node.drawChildLines();

  // if there are generations left, repeat algothrithm for children
  if (n > 0) {
    node.children.forEach((child_node) => {
      setTimeout(() => simpleBranch(child_node, n - 1), gen_delay);
    });
  }
}

// simpleBranch(Tree, 1);

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function simulate() {
  drawBackground("black");
  Tree.children = [];
  simpleBranch(Tree, generations);
}

/**
 * Class for nodes generated during simulations
 */

class TreeNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    /**
     * @type {TreeNode[]}
     */
    this.children = [];
  }

  addChild(x, y) {
    this.children.push(new TreeNode(x, y));
  }

  /**
   * @param {[number, number]} points
   */
  addChildren(points) {
    points.forEach((p) => {
      this.children.push(new TreeNode(p[0], p[1]));
    });
  }

  drawChildLines() {
    this.children.forEach((c) => {
      drawLine(this.x, this.y, c.x, c.y, "white", 1);
      drawCircle(c.x, c.y, 6, "rgba(255, 0, 0, 0.2)");
    });
  }
}

class Shape {
  constructor(x, y, fill = "*") {
    this.x = x;
    this.y = y;
    this.fill = fill;
  }

  draw(canvas, canvasWidth, canvasHeight) {}

  move(dx, dy) {}

  erase(canvas, canvasWidth, canvasHeight) {}

  toJSON() {}
}

module.exports = Shape;

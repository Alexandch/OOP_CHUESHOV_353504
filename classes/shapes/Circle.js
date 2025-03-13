const Shape = require("../Shape");

class Circle extends Shape {
  constructor(x, y, radius, fill) {
    super(x, y, fill);
    if (radius < 0) {
      throw new Error("Radius cannot be negative");
    }
    this.radius = radius;
  }

  draw(canvas, canvasWidth, canvasHeight) {
    const xc = this.x;
    const yc = this.y;
    const r = this.radius;

    if (r === 0) {
      return;
    }

    for (let i = yc - r; i <= yc + r && i < canvasHeight; i++) {
      for (let j = xc - r; j <= xc + r && j < canvasWidth; j++) {
        if (i >= 0 && j >= 0) {
          const dx = j - xc;
          const dy = i - yc;
          if (dx * dx + dy * dy <= r * r) {
            canvas[i][j] = this.fill;
          }
        }
      }
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  erase(canvas, canvasWidth, canvasHeight) {
    const xc = this.x;
    const yc = this.y;
    const r = this.radius;

    for (let i = yc - r; i <= yc + r && i < canvasHeight; i++) {
      for (let j = xc - r; j <= xc + r && j < canvasWidth; j++) {
        if (i >= 0 && j >= 0) {
          const dx = j - xc;
          const dy = i - yc;
          if (dx * dx + dy * dy <= r * r) {
            canvas[i][j] = " ";
          }
        }
      }
    }
  }

  toJSON() {
    return {
      type: "Circle",
      x: this.x,
      y: this.y,
      radius: this.radius,
      fill: this.fill,
    };
  }

  toString() {
    return `Круг (${this.x}, ${this.y}), радиус: ${this.radius}, заливка: ${this.fill}`;
  }
}

module.exports = Circle;

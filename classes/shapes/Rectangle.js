const Shape = require("../Shape");

class Rectangle extends Shape {
  constructor(x, y, width, height, fill) {
    super(x, y, fill);
    this.width = width;
    this.height = height;
  }

  draw(canvas, canvasWidth, canvasHeight) {
    for (let i = this.y; i < this.y + this.height && i < canvasHeight; i++) {
      for (let j = this.x; j < this.x + this.width && j < canvasWidth; j++) {
        if (i >= 0 && j >= 0) canvas[i][j] = this.fill;
      }
    }
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  erase(canvas, canvasWidth, canvasHeight) {
    for (let i = this.y; i < this.y + this.height && i < canvasHeight; i++) {
      for (let j = this.x; j < this.x + this.width && j < canvasWidth; j++) {
        if (i >= 0 && j >= 0) canvas[i][j] = " ";
      }
    }
  }

  toJSON() {
    return {
      type: "Rectangle",
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      fill: this.fill,
    };
  }

  toString() {
    return `Прямоугольник (${this.x}, ${this.y}), ширина: ${this.width}, высота: ${this.height}, заливка: ${this.fill}`;
  }
}

module.exports = Rectangle;

const Shape = require("../Shape");

class Line extends Shape {
  constructor(x1, y1, x2, y2, fill = "*") {
    super(x1, y1, fill);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  // Отрисовка линии с помощью алгоритма Брезенхэма
  draw(canvas, canvasWidth, canvasHeight) {
    let x1 = this.x1;
    let y1 = this.y1;
    let x2 = this.x2;
    let y2 = this.y2;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x1 >= 0 && x1 < canvasWidth && y1 >= 0 && y1 < canvasHeight) {
        canvas[y1][x1] = this.fill;
      }
      if (x1 === x2 && y1 === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  move(dx, dy) {
    this.x1 += dx;
    this.y1 += dy;
    this.x2 += dx;
    this.y2 += dy;
  }

  erase(canvas, canvasWidth, canvasHeight) {
    let x1 = this.x1;
    let y1 = this.y1;
    let x2 = this.x2;
    let y2 = this.y2;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x1 >= 0 && x1 < canvasWidth && y1 >= 0 && y1 < canvasHeight) {
        canvas[y1][x1] = " ";
      }
      if (x1 === x2 && y1 === y2) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  toJSON() {
    return {
      type: "Line",
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      fill: this.fill,
    };
  }

  toString() {
    return `Линия от (${this.x1}, ${this.y1}) до (${this.x2}, ${this.y2}), заливка: ${this.fill}`;
  }
}

module.exports = Line;

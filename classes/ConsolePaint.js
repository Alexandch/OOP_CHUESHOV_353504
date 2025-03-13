const Rectangle = require("./shapes/Rectangle");

class ConsolePaint {
  constructor(width = 100, height = 30) {
    this.width = width;
    this.height = height;
    this.canvas = Array(height)
      .fill()
      .map(() => Array(width).fill(" "));

    this.history = [];
    this.redoStack = [];
    this.shapes = [];
  }

  display() {
    console.clear();

    const topLeft = "┌";
    const topRight = "┐";
    const bottomLeft = "└";
    const bottomRight = "┘";
    const horizontal = "─";
    const vertical = "│";

    console.log(topLeft + horizontal.repeat(this.width) + topRight);
    this.canvas.forEach((row) => {
      console.log(vertical + row.join("") + vertical);
    });
    console.log(bottomLeft + horizontal.repeat(this.width) + bottomRight);
  }

  drawAll() {
    this.canvas = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(" "));
    for (const shape of this.shapes) {
      shape.draw(this.canvas, this.width, this.height);
    }
    this.display();
  }

  saveState() {
    this.history.push({
      canvas: JSON.stringify(this.canvas),
      shapes: [...this.shapes],
    });
    this.redoStack = [];
  }

  drawShape(shape) {
    this.saveState();
    shape.draw(this.canvas, this.width, this.height);
    this.shapes.push(shape);
    this.display();
  }

  moveShape(index, dx, dy) {
    if (index < 0 || index >= this.shapes.length) {
      console.log("Неверный индекс фигуры");
      return;
    }
    this.saveState();
    const shape = this.shapes[index];
    shape.move(dx, dy);
    this.drawAll();
  }

  clearShape(index) {
    if (index < 0 || index >= this.shapes.length) {
      console.log("Неверный индекс фигуры");
      return;
    }
    this.saveState();
    this.shapes.splice(index, 1);
    this.drawAll();
  }

  clear() {
    this.saveState();
    this.canvas = Array(this.height)
      .fill()
      .map(() => Array(this.width).fill(" "));
    this.shapes = [];
    this.display();
  }

  save(filename) {
    const match = filename.match(".json");
    if (!match) {
      filename += ".json";
    }
    const fs = require("fs");
    const shapesData = this.shapes.map((shape) => shape.toJSON());
    fs.writeFileSync(`./saves/${filename}`, JSON.stringify(shapesData));
    return `Сохранено в ${filename}`;
  }

  load(filename) {
    const match = filename.match(".json");
    if (!match) {
      filename += ".json";
    }
    const fs = require("fs");
    const Rectangle = require("./shapes/Rectangle");
    const Circle = require("./shapes/Circle");
    const Line = require("./shapes/Line");
    try {
      this.saveState();
      const shapesData = JSON.parse(
        fs.readFileSync(`./saves/${filename}`, "utf8")
      );
      this.shapes = shapesData?.map((data) => {
        if (data.type === "Rectangle") {
          return new Rectangle(
            data.x,
            data.y,
            data.width,
            data.height,
            data.fill
          );
        } else if (data.type === "Circle") {
          return new Circle(data.x, data.y, data.radius, data.fill);
        } else if (data.type === "Line") {
          return new Line(data.x1, data.y1, data.x2, data.y2, data.fill);
        }
        throw new Error("Неизвестный тип фигуры");
      });
      this.drawAll();
    } catch (e) {
      return "Ошибка при загрузке файла: " + e.message;
    }
  }

  displayShapes() {
    if (this.shapes.length === 0) {
      console.log("На холсте нет фигур.");
      return;
    }
    console.log("Список фигур:");
    this.shapes.forEach((shape, index) => {
      console.log(`${index}: ${shape.toString()}`);
    });
  }

  undo() {
    if (this.history.length > 0) {
      this.redoStack.push({
        canvas: JSON.stringify(this.canvas),
        shapes: [...this.shapes],
      });

      const previousState = this.history.pop();
      this.canvas = JSON.parse(previousState.canvas);
      this.shapes = [...previousState.shapes];
      this.display();
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      this.history.push({
        canvas: JSON.stringify(this.canvas),
        shapes: [...this.shapes],
      });
      const nextState = this.redoStack.pop();
      this.canvas = JSON.parse(nextState.canvas);
      this.shapes = [...nextState.shapes];
      this.display();
    }
  }
}

module.exports = ConsolePaint;

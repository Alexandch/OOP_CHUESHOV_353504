const ConsolePaint = require("../classes/ConsolePaint");
const Rectangle = require("../classes/shapes/Rectangle");
jest.mock("fs");

describe("ConsolePaint", () => {
  let paint;

  beforeEach(() => {
    paint = new ConsolePaint(10, 10);
    console.log = jest.fn();
    console.clear = jest.fn();
    jest.clearAllMocks();
  });

  test("drawAll redraws all shapes", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.drawAll();
    expect(paint.canvas[0][0]).toBe("*");
  });

  test("saveState saves the current state", () => {
    paint.saveState();
    expect(paint.history.length).toBe(1);
  });

  test("drawShape adds a shape and displays it", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.drawShape(rect);
    expect(paint.shapes.length).toBe(1);
    expect(paint.canvas[0][0]).toBe("*");
    expect(console.clear).toHaveBeenCalled();
  });

  test("moveShape moves the shape and redraws it", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.moveShape(0, 2, 2);
    expect(rect.x).toBe(2);
    expect(rect.y).toBe(2);
  });

  test("clearShape deletes the shape and redraws canvas", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.clearShape(0);
    expect(paint.shapes.length).toBe(0);
  });

  test("clear clears the canvas and removes shapes", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.clear();
    expect(paint.shapes.length).toBe(0);
    expect(paint.canvas[0][0]).toBe(" ");
  });

  test("save saves shapes to a file", () => {
    const fs = require("fs");
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.save("test");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "./saves/test.json",
      JSON.stringify([
        { type: "Rectangle", x: 0, y: 0, width: 3, height: 3, fill: "*" },
      ])
    );
  });

  test("load loads shapes from a file", () => {
    const fs = require("fs");
    const shapesData = [
      { type: "Rectangle", x: 0, y: 0, width: 3, height: 3, fill: "*" },
    ];
    fs.readFileSync.mockReturnValue(JSON.stringify(shapesData));
    paint.load("test");
    expect(paint.shapes.length).toBe(1);
    expect(paint.shapes[0] instanceof Rectangle).toBe(true);
  });

  test("displayShapes displays a list of shapes", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.displayShapes();
    expect(console.log).toHaveBeenCalledWith("Список фигур:");
    expect(console.log).toHaveBeenCalledWith(
      "0: Прямоугольник (0, 0), ширина: 3, высота: 3, заливка: *"
    );
  });

  test("undo undoes the last action", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.drawShape(rect);
    paint.undo();
    expect(paint.shapes.length).toBe(0);
  });

  test("redo redoes the undone action", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.drawShape(rect);
    paint.undo();
    paint.redo();
    expect(paint.shapes.length).toBe(1);
  });

  test("saveState does not overflow history", () => {
    for (let i = 0; i < 100; i++) {
      paint.saveState();
    }
    expect(paint.history.length).toBe(100);
  });

  test("drawShape outside canvas", () => {
    const rect = new Rectangle(100, 100, 3, 3, "*");
    paint.drawShape(rect);
    expect(paint.shapes.length).toBe(1);
    expect(paint.canvas[0][0]).toBe(" ");
  });

  test("moveShape outside canvas", () => {
    const rect = new Rectangle(0, 0, 3, 3, "*");
    paint.shapes.push(rect);
    paint.moveShape(0, 100, 100);
    expect(rect.x).toBe(100);
    expect(rect.y).toBe(100);
  });

  test("clearShape with invalid index", () => {
    paint.clearShape(-1);
    expect(console.log).toHaveBeenCalledWith("Неверный индекс фигуры");
    expect(paint.shapes.length).toBe(0);
  });

  test("clear with blank canvas", () => {
    paint.clear();
    expect(paint.shapes.length).toBe(0);
    expect(paint.canvas[0][0]).toBe(" ");
  });

  test("load from non-existent file", () => {
    const fs = require("fs");
    fs.readFileSync.mockImplementation(() => {
      throw new Error("Файл не найден");
    });
    expect(paint.load("nonexistent")).toBe(
      "Ошибка при загрузке файла: Файл не найден"
    );
  });

  test("displayShapes without shapes", () => {
    paint.displayShapes();
    expect(console.log).toHaveBeenCalledWith("На холсте нет фигур.");
  });

  test("undo with empty history", () => {
    paint.undo();
    expect(paint.shapes.length).toBe(0);
  });

  test("redo with empty redo stack", () => {
    paint.redo();
    expect(paint.shapes.length).toBe(0);
  });
});

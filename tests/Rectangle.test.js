const Rectangle = require("../classes/shapes/Rectangle");

describe("Rectangle", () => {
  test("constructor sets properties correctly", () => {
    const rect = new Rectangle(0, 0, 10, 5, "#");
    expect(rect.x).toBe(0);
    expect(rect.y).toBe(0);
    expect(rect.width).toBe(10);
    expect(rect.height).toBe(5);
    expect(rect.fill).toBe("#");
  });

  test("draw fills the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const rect = new Rectangle(2, 2, 3, 3, "*");
    rect.draw(canvas, 10, 10);
    for (let i = 2; i < 5; i++) {
      for (let j = 2; j < 5; j++) {
        expect(canvas[i][j]).toBe("*");
      }
    }
  });

  test("move updates position", () => {
    const rect = new Rectangle(0, 0, 10, 5, "*");
    rect.move(5, 5);
    expect(rect.x).toBe(5);
    expect(rect.y).toBe(5);
  });

  test("erase clears the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill("*"));
    const rect = new Rectangle(2, 2, 3, 3, "*");
    rect.erase(canvas, 10, 10);
    for (let i = 2; i < 5; i++) {
      for (let j = 2; j < 5; j++) {
        expect(canvas[i][j]).toBe(" ");
      }
    }
  });

  test("toJSON returns correct object", () => {
    const rect = new Rectangle(0, 0, 10, 5, "*");
    expect(rect.toJSON()).toEqual({
      type: "Rectangle",
      x: 0,
      y: 0,
      width: 10,
      height: 5,
      fill: "*",
    });
  });

  test("toString returns correct string", () => {
    const rect = new Rectangle(0, 0, 10, 5, "*");
    expect(rect.toString()).toBe(
      "Прямоугольник (0, 0), ширина: 10, высота: 5, заливка: *"
    );
  });

  test("rectangle with width = 0", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const rect = new Rectangle(0, 0, 0, 5, "*");
    rect.draw(canvas, 10, 10);
    expect(canvas).toEqual(
      Array(10)
        .fill()
        .map(() => Array(10).fill(" "))
    );
  });

  test("rectangle partially outside the canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const rect = new Rectangle(-2, -2, 5, 5, "*");
    rect.draw(canvas, 10, 10);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expect(canvas[i][j]).toBe("*");
      }
    }
  });

  test("rectangle is completely outside the canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const rect = new Rectangle(100, 100, 5, 5, "*");
    rect.draw(canvas, 10, 10);
    expect(canvas).toEqual(
      Array(10)
        .fill()
        .map(() => Array(10).fill(" "))
    );
  });

  test("rectangle on the entire canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const rect = new Rectangle(0, 0, 10, 10, "*");
    rect.draw(canvas, 10, 10);
    expect(canvas).toEqual(
      Array(10)
        .fill()
        .map(() => Array(10).fill("*"))
    );
  });

  test("null fill symbol returns default '*'", () => {
    const rect = new Rectangle(0, 0, 5, 5);
    expect(rect.fill).toBe("*");
  });
});

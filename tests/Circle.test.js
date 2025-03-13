const Circle = require("../classes/shapes/Circle");

describe("Circle", () => {
  test("constructor sets properties correctly", () => {
    const circle = new Circle(5, 5, 3, "#");
    expect(circle.x).toBe(5);
    expect(circle.y).toBe(5);
    expect(circle.radius).toBe(3);
    expect(circle.fill).toBe("#");
  });

  test("draw fills the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const circle = new Circle(5, 5, 2, "*");
    circle.draw(canvas, 10, 10);
    expect(canvas[5][5]).toBe("*");
    expect(canvas[5][7]).toBe("*");
    expect(canvas[5][3]).toBe("*");
    expect(canvas[7][5]).toBe("*");
    expect(canvas[3][5]).toBe("*");
    expect(canvas[5][8]).toBe(" ");
    expect(canvas[5][2]).toBe(" ");
    expect(canvas[8][5]).toBe(" ");
    expect(canvas[2][5]).toBe(" ");
  });

  test("move updates position", () => {
    const circle = new Circle(0, 0, 3, "*");
    circle.move(2, 3);
    expect(circle.x).toBe(2);
    expect(circle.y).toBe(3);
  });

  test("erase clears the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill("*"));
    const circle = new Circle(5, 5, 2, "*");
    circle.erase(canvas, 10, 10);
    expect(canvas[5][5]).toBe(" ");
    expect(canvas[5][7]).toBe(" ");
    expect(canvas[5][3]).toBe(" ");
    expect(canvas[7][5]).toBe(" ");
    expect(canvas[3][5]).toBe(" ");
    expect(canvas[5][8]).toBe("*");
    expect(canvas[5][2]).toBe("*");
    expect(canvas[8][5]).toBe("*");
    expect(canvas[2][5]).toBe("*");
  });

  test("toJSON returns correct object", () => {
    const circle = new Circle(0, 0, 3, "*");
    expect(circle.toJSON()).toEqual({
      type: "Circle",
      x: 0,
      y: 0,
      radius: 3,
      fill: "*",
    });
  });

  test("toString returns correct string", () => {
    const circle = new Circle(0, 0, 3, "*");
    expect(circle.toString()).toBe("Круг (0, 0), радиус: 3, заливка: *");
  });

  test("circle with radius = 0", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const circle = new Circle(5, 5, 0, "*");
    circle.draw(canvas, 10, 10);
    expect(canvas).toEqual(
      Array(10)
        .fill()
        .map(() => Array(10).fill(" "))
    );
  });

  test("circle with negative radius", () => {
    expect(() => new Circle(5, 5, -3, "*")).toThrow();
  });

  test("circle partially outside the canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const circle = new Circle(-2, -2, 5, "*");
    circle.draw(canvas, 10, 10);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const dx = j - -2;
        const dy = i - -2;
        if (dx * dx + dy * dy <= 25) {
          expect(canvas[i][j]).toBe("*");
        } else {
          expect(canvas[i][j]).toBe(" ");
        }
      }
    }
  });

  test("circle completely outside the canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const circle = new Circle(100, 100, 5, "*");
    circle.draw(canvas, 10, 10);
    expect(canvas).toEqual(
      Array(10)
        .fill()
        .map(() => Array(10).fill(" "))
    );
  });

  test("circle covering the entire canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const circle = new Circle(5, 5, 10, "*");
    circle.draw(canvas, 10, 10);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const dx = j - 5;
        const dy = i - 5;
        if (dx * dx + dy * dy <= 100) {
          expect(canvas[i][j]).toBe("*");
        } else {
          expect(canvas[i][j]).toBe(" ");
        }
      }
    }
  });
});

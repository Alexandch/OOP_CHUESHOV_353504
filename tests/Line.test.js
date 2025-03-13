const Line = require("../classes/shapes/Line");

describe("Line", () => {
  test("constructor sets properties correctly", () => {
    const line = new Line(0, 0, 5, 5, "#");
    expect(line.x1).toBe(0);
    expect(line.y1).toBe(0);
    expect(line.x2).toBe(5);
    expect(line.y2).toBe(5);
    expect(line.fill).toBe("#");
  });

  test("draw fills the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(0, 0, 4, 4, "*");
    line.draw(canvas, 10, 10);
    expect(canvas[0][0]).toBe("*");
    expect(canvas[2][2]).toBe("*");
    expect(canvas[4][4]).toBe("*");
  });

  test("draw horizontal line", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(0, 5, 9, 5, "*");
    line.draw(canvas, 10, 10);
    for (let i = 0; i < 10; i++) {
      expect(canvas[5][i]).toBe("*");
    }
  });

  test("draw vertical line", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(5, 0, 5, 9, "*");
    line.draw(canvas, 10, 10);
    for (let i = 0; i < 10; i++) {
      expect(canvas[i][5]).toBe("*");
    }
  });

  test("move updates position", () => {
    const line = new Line(0, 0, 5, 5, "*");
    line.move(2, 3);
    expect(line.x1).toBe(2);
    expect(line.y1).toBe(3);
    expect(line.x2).toBe(7);
    expect(line.y2).toBe(8);
  });

  test("erase clears the canvas correctly", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill("*"));
    const line = new Line(0, 0, 4, 4, "*");
    line.erase(canvas, 10, 10);
    expect(canvas[0][0]).toBe(" ");
    expect(canvas[2][2]).toBe(" ");
    expect(canvas[4][4]).toBe(" ");
  });

  test("toJSON returns correct object", () => {
    const line = new Line(0, 0, 5, 5, "*");
    expect(line.toJSON()).toEqual({
      type: "Line",
      x1: 0,
      y1: 0,
      x2: 5,
      y2: 5,
      fill: "*",
    });
  });

  test("toString returns correct string", () => {
    const line = new Line(0, 0, 5, 5, "*");
    expect(line.toString()).toBe("Линия от (0, 0) до (5, 5), заливка: *");
  });

  test("line with matching points", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(2, 2, 2, 2, "*");
    line.draw(canvas, 10, 10);
    expect(canvas[2][2]).toBe("*");
    expect(canvas[2][3]).toBe(" ");
  });

  test("line is partially outside the canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(0, 0, 15, 15, "*");
    line.draw(canvas, 10, 10);
    expect(canvas[0][0]).toBe("*");
    expect(canvas[9][9]).toBe("*");
  });

  test("line across the entire canvas", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(0, 0, 9, 9, "*");
    line.draw(canvas, 10, 10);
    for (let i = 0; i < 10; i++) {
      expect(canvas[i][i]).toBe("*");
    }
  });

  test("draw line in reverse direction", () => {
    const canvas = Array(10)
      .fill()
      .map(() => Array(10).fill(" "));
    const line = new Line(9, 9, 0, 0, "*");
    line.draw(canvas, 10, 10);
    for (let i = 0; i < 10; i++) {
      expect(canvas[i][i]).toBe("*");
    }
  });
});

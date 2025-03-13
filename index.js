const ConsolePaint = require("./classes/ConsolePaint");
const Rectangle = require("./classes/shapes/Rectangle");
const Circle = require("./classes/shapes/Circle");
const Line = require("./classes/shapes/Line");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const menu = `
==========================
Выберите действие:
1. Нарисовать прямоугольник
2. Нарисовать линию
3. Нарисовать круг
4. Переместить фигуру
5. Очистить фигуру
6. Очистить холст
7. Отменить действие
8. Повторить отменённое действие
9. Сохранить в файл
10. Загрузить из файла
11. Показать список фигур
12. Выход
`;

function promptInput(question) {
  return new Promise((resolve) => readline.question(question, resolve));
}

async function tapToContinue() {
  await promptInput("Нажмите Enter, чтобы продолжить...");
}
async function promptIntegerInput(question) {
  while (true) {
    const input = await promptInput(question);
    const parsed = parseInt(input);
    if (!isNaN(parsed)) {
      return parsed;
    }
    console.log("Ошибка: введите целое число!");
  }
}

async function mainLoop(paint) {
  while (true) {
    paint.display();
    console.log(menu);
    const choice = await promptInput("Введите номер команды: ");

    switch (choice) {
      case "1": {
        const x = await promptIntegerInput("Введите x: ");
        const y = await promptIntegerInput("Введите y: ");
        let w = await promptIntegerInput("Введите ширину: ");
        if (w <= 0) {
          console.log("Ошибка: ширина должна быть положительным числом!");
          w = await promptIntegerInput("Введите ширину: ");
          break;
        }
        const h = await promptIntegerInput("Введите высоту: ");
        if (h <= 0) {
          console.log("Ошибка: высота должна быть положительным числом!");
          await tapToContinue();
          break;
        }
        const fill =
          (await promptInput("Введите символ заливки (по умолчанию *): ")) ||
          "*";
        if (fill.length !== 1) {
          console.log("Ошибка: символ заливки должен быть одним символом!");
          await tapToContinue();
          break;
        }
        paint.drawShape(new Rectangle(x, y, w, h, fill));
        break;
      }
      case "2": {
        const x1 = await promptIntegerInput("Введите x1: ");
        const y1 = await promptIntegerInput("Введите y1: ");
        const x2 = await promptIntegerInput("Введите x2: ");
        const y2 = await promptIntegerInput("Введите y2: ");
        const fill =
          (await promptInput("Введите символ заливки (по умолчанию *): ")) ||
          "*";
        if (fill.length !== 1) {
          console.log("Ошибка: символ заливки должен быть одним символом!");
          await tapToContinue();
          break;
        }
        paint.drawShape(new Line(x1, y1, x2, y2, fill));
        break;
      }
      case "3": {
        const x = await promptIntegerInput("Введите x центра: ");
        const y = await promptIntegerInput("Введите y центра: ");
        const r = await promptIntegerInput("Введите радиус: ");
        if (r <= 0) {
          console.log("Ошибка: радиус должен быть положительным числом!");
          await tapToContinue();
          break;
        }
        const fill =
          (await promptInput("Введите символ заливки (по умолчанию *): ")) ||
          "*";
        if (fill.length !== 1) {
          console.log("Ошибка: символ заливки должен быть одним символом!");
          await tapToContinue();
          break;
        }
        paint.drawShape(new Circle(x, y, r, fill));
        break;
      }
      case "4": {
        paint.displayShapes();
        const index = await promptIntegerInput(
          "Введите индекс фигуры для перемещения: "
        );
        if (index < 0 || index >= paint.shapes.length) {
          console.log("Ошибка: индекс должен быть в пределах списка фигур!");
          await tapToContinue();
          break;
        }
        const dx = await promptIntegerInput("Сдвиг по горизонтали (dx): ");
        const dy = await promptIntegerInput("Сдвиг по вертикали (dy): ");
        paint.moveShape(index, dx, dy);
        break;
      }
      case "5": {
        paint.displayShapes();
        const index = parseInt(
          await promptInput("Введите индекс фигуры для очистки: ")
        );
        if (isNaN(index) || index < 0 || index >= paint.shapes.length) {
          console.log(
            "Ошибка: индекс должен быть числом в пределах списка фигур!"
          );
          await tapToContinue();
          break;
        }
        paint.clearShape(index);
        break;
      }
      case "6": {
        paint.clear();
        break;
      }
      case "7": {
        paint.undo();
        break;
      }
      case "8": {
        paint.redo();
        break;
      }
      case "9": {
        let filename =
          (await promptInput("Введите имя файла (по умолчанию canvas): ")) ||
          "canvas";
        if (!filename) {
          console.log("Ошибка: имя файла не может быть пустым!");
        } else {
          const saveMessage = paint.save(filename);
          console.log(saveMessage);
        }
        await tapToContinue();
        break;
      }
      case "10": {
        let filename = await promptInput("Введите имя файла: ");
        if (!filename) {
          console.log("Ошибка: имя файла не может быть пустым!");
        } else {
          const loadMessage = paint.load(filename);
          if (loadMessage) {
            console.log(loadMessage);
            await tapToContinue();
          }
        }
        break;
      }
      case "11": {
        paint.displayShapes();
        await tapToContinue();
        break;
      }
      case "12": {
        console.log("Программа завершена!");
        readline.close();
        return;
      }
      default:
        console.log("Неверный выбор! Введите число от 1 до 12.");
        await tapToContinue();
    }
  }
}

const paint = new ConsolePaint();
mainLoop(paint);

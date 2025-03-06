import tkinter as tk
from tkinter import messagebox, simpledialog, Button
import json

# Базовый класс для фигур
class Shape:
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color

    def draw(self, canvas):
        raise NotImplementedError("Метод draw должен быть реализован в подклассах")

    def move(self, new_x, new_y):
        self.x = new_x
        self.y = new_y

    def to_dict(self):
        raise NotImplementedError("Метод to_dict должен быть реализован в подклассах")

    @staticmethod
    def from_dict(data):
        raise NotImplementedError("Метод from_dict должен быть реализован в подклассах")

# Класс круга
class Circle(Shape):
    def __init__(self, x, y, radius, color):
        super().__init__(x, y, color)
        self.radius = radius

    def draw(self, canvas):
        canvas.create_oval(self.x - self.radius, self.y - self.radius,
                           self.x + self.radius, self.y + self.radius,
                           fill=self.color)

    def to_dict(self):
        return {"type": "circle", "x": self.x, "y": self.y, "radius": self.radius, "color": self.color}

    @staticmethod
    def from_dict(data):
        return Circle(data["x"], data["y"], data["radius"], data["color"])

# Класс прямоугольника
class Rectangle(Shape):
    def __init__(self, x, y, width, height, color):
        super().__init__(x, y, color)
        self.width = width
        self.height = height

    def draw(self, canvas):
        canvas.create_rectangle(self.x, self.y,
                                self.x + self.width, self.y + self.height,
                                fill=self.color)

    def to_dict(self):
        return {"type": "rectangle", "x": self.x, "y": self.y, "width": self.width, "height": self.height, "color": self.color}

    @staticmethod
    def from_dict(data):
        return Rectangle(data["x"], data["y"], data["width"], data["height"], data["color"])

# Класс линии
class Line(Shape):
    def __init__(self, x1, y1, x2, y2, color):
        super().__init__(x1, y1, color)
        self.x2 = x2
        self.y2 = y2

    def draw(self, canvas):
        canvas.create_line(self.x, self.y, self.x2, self.y2, fill=self.color)

    def move(self, new_x, new_y):
        dx = new_x - self.x
        dy = new_y - self.y
        self.x += dx
        self.y += dy
        self.x2 += dx
        self.y2 += dy

    def to_dict(self):
        return {"type": "line", "x1": self.x, "y1": self.y, "x2": self.x2, "y2": self.y2, "color": self.color}

    @staticmethod
    def from_dict(data):
        return Line(data["x1"], data["y1"], data["x2"], data["y2"], data["color"])

# Класс холста
class CanvasApp:
    def __init__(self, master):
        self.master = master
        self.canvas = tk.Canvas(master, width=800, height=600, bg="white")
        self.canvas.pack()
        self.shapes = []
        self.background = "white"
        self.next_id = 1
        self.frame = tk.Frame(master)
        self.frame.pack(fill="both", expand=True)
        self.hbar = tk.Scrollbar(self.frame, orient="horizontal")
        self.hbar.pack(side="bottom", fill="x")
        self.vbar = tk.Scrollbar(self.frame, orient="vertical")
        self.vbar.pack(side="right", fill="y")

        self.canvas = tk.Canvas(self.frame, width=800, height=600, bg="white",
                                xscrollcommand=self.hbar.set, yscrollcommand=self.vbar.set)
        self.canvas.pack(side="left", fill="both", expand=True)

        self.hbar.config(command=self.canvas.xview)
        self.vbar.config(command=self.canvas.yview)

        self.shapes = []        
        self.background = "white"  
        self.next_id = 1

    def add_shape(self, shape):
        self.shapes.append((self.next_id, shape))
        self.next_id += 1
        self.redraw()

    def erase_shape(self, shape_id):
        for i, (id_, shape) in enumerate(self.shapes):
            if id_ == shape_id:
                del self.shapes[i]
                self.redraw()
                return shape
        messagebox.showerror("Ошибка", f"Фигура с ID {shape_id} не найдена")
        return None

    def move_shape(self, shape_id, new_x, new_y):
        for id_, shape in self.shapes:
            if id_ == shape_id:
                shape.move(new_x, new_y)
                self.redraw()
                return
        messagebox.showerror("Ошибка", f"Фигура с ID {shape_id} не найдена")

    def set_background(self, color):
        self.background = color
        self.canvas.config(bg=color)
        self.redraw()

    def redraw(self):
        self.canvas.delete("all")  
        for id_, shape in self.shapes:
            shape.draw(self.canvas)  
        self.update_scrollregion()  

    def update_scrollregion(self):
        if self.shapes:
            min_x = min(shape.x for _, shape in self.shapes)
            min_y = min(shape.y for _, shape in self.shapes)
            max_x = max(shape.x + (getattr(shape, 'width', 0) or shape.radius * 2) for _, shape in self.shapes)
            max_y = max(shape.y + (getattr(shape, 'height', 0) or shape.radius * 2) for _, shape in self.shapes)
           
            self.canvas.config(scrollregion=(min_x - 50, min_y - 50, max_x + 50, max_y + 50))
        else:
            # Если фигур нет, задаем область по умолчанию
            self.canvas.config(scrollregion=(0, 0, 800, 600))
    def to_dict(self):
        return {
            "background": self.background,
            "shapes": [(id_, shape.to_dict()) for id_, shape in self.shapes],
            "next_id": self.next_id
        }

    @staticmethod
    def from_dict(data, master):
        app = CanvasApp(master)
        app.background = data["background"]  
        app.next_id = data["next_id"]       
        for id_, shape_data in data["shapes"]:
            if shape_data["type"] == "circle":
                shape = Circle.from_dict(shape_data)
            elif shape_data["type"] == "rectangle":
                shape = Rectangle.from_dict(shape_data)
            elif shape_data["type"] == "line":
                 shape = Line.from_dict(shape_data)
        app.shapes.append((id_, shape))  
        app.set_background(app.background)  
        app.redraw()                        
        return app
    
class Command:
    def execute(self):
        raise NotImplementedError("Метод execute должен быть реализован")

    def undo(self):
        raise NotImplementedError("Метод undo должен быть реализован")
    
class AddShapeCommand(Command):
    def __init__(self, canvas_app, shape):
        self.canvas_app = canvas_app  # Ссылка на объект приложения
        self.shape = shape           # Фигура, которую добавляем
        self.shape_id = None         # ID добавленной фигуры

    def execute(self):
        self.shape_id = self.canvas_app.next_id  # Предполагается, что next_id генерирует уникальный ID
        self.canvas_app.add_shape(self.shape)    # Метод добавления фигуры

    def undo(self):
        self.canvas_app.erase_shape(self.shape_id)  # Метод удаления фигуры

class EraseShapeCommand(Command):
    def __init__(self, canvas_app, shape_id):
        self.canvas_app = canvas_app
        self.shape_id = shape_id
        self.shape = None  # Для хранения удалённой фигуры

    def execute(self):
        self.shape = self.canvas_app.erase_shape(self.shape_id)  # Сохраняем фигуру перед удалением

    def undo(self):
        if self.shape:
            self.canvas_app.add_shape(self.shape)  # Восстанавливаем фигуру

class MoveShapeCommand(Command):
    def __init__(self, canvas_app, shape_id, new_x, new_y):
        self.canvas_app = canvas_app
        self.shape_id = shape_id
        self.new_x = new_x
        self.new_y = new_y
        self.old_x = None  # Для хранения старой позиции
        self.old_y = None

    def execute(self):
        for id_, shape in self.canvas_app.shapes:  # Предполагается, что shapes — список фигур
            if id_ == self.shape_id:
                self.old_x = shape.x
                self.old_y = shape.y
                self.canvas_app.move_shape(self.shape_id, self.new_x, self.new_y)
                return

    def undo(self):
        if self.old_x is not None and self.old_y is not None:
            self.canvas_app.move_shape(self.shape_id, self.old_x, self.old_y)

class SetBackgroundCommand(Command):
    def __init__(self, canvas_app, color):
        self.canvas_app = canvas_app
        self.new_color = color
        self.old_color = None

    def execute(self):
        self.old_color = self.canvas_app.background  # Сохраняем текущий цвет
        self.canvas_app.set_background(self.new_color)  # Устанавливаем новый цвет

    def undo(self):
        self.canvas_app.set_background(self.old_color)  # Восстанавливаем старый цвет

class History:
    def __init__(self):
        self.undo_stack = []  # Стек для отмены действий
        self.redo_stack = []  # Стек для повтора действий

    def execute_command(self, command):
        command.execute()          # Выполняем команду
        self.undo_stack.append(command)  # Добавляем в стек отмены
        self.redo_stack.clear()    # Очищаем стек повтора

    def undo(self):
        if self.undo_stack:
            command = self.undo_stack.pop()  # Берём последнюю команду
            command.undo()                   # Отменяем её
            self.redo_stack.append(command)  # Добавляем в стек повтора
        else:
            print("Нет действий для отмены")

    def redo(self):
        if self.redo_stack:
            command = self.redo_stack.pop()  # Берём команду из стека повтора
            command.execute()                # Выполняем её
            self.undo_stack.append(command)  # Добавляем в стек отмены
        else:
            print("Нет действий для повтора")

# Основной класс приложения
class PaintApp:
    def __init__(self, master):
        self.master = master
        self.master.title("Paint App")
        self.canvas_app = CanvasApp(master)
        self.history = History()

        # Создание меню
        menubar = tk.Menu(master)
        master.config(menu=menubar)

        file_menu = tk.Menu(menubar, tearoff=0)
        menubar.add_cascade(label="Файл", menu=file_menu)
        file_menu.add_command(label="Сохранить", command=self.save_canvas)
        file_menu.add_command(label="Загрузить", command=self.load_canvas)
        file_menu.add_separator()
        file_menu.add_command(label="Выход", command=master.quit)

        edit_menu = tk.Menu(menubar, tearoff=0)
        edit_menu.add_command(label="Отменить", command=self.undo)
        edit_menu.add_command(label="Повторить", command=self.redo)
        menubar.add_cascade(label="Правка", menu=edit_menu)
        edit_menu.add_command(label="Добавить круг", command=self.add_circle)
        edit_menu.add_command(label="Добавить прямоугольник", command=self.add_rectangle)
        edit_menu.add_command(label="Добавить линию", command=self.add_line)
        edit_menu.add_command(label="Удалить фигуру", command=self.erase_shape)
        edit_menu.add_command(label="Переместить фигуру", command=self.move_shape)
        edit_menu.add_command(label="Установить фон", command=self.set_background)
        Button(master, text="Undo", command=self.undo).pack(side="left")
        Button(master, text="Redo", command=self.redo).pack(side="left")

    def add_circle(self):
        x = simpledialog.askinteger("Ввод", "Введите x:")
        y = simpledialog.askinteger("Ввод", "Введите y:")
        radius = simpledialog.askinteger("Ввод", "Введите радиус:")
        color = simpledialog.askstring("Ввод", "Введите цвет:")
        if x and y and radius and color:
            circle = Circle(x, y, radius, color)  
            command = AddShapeCommand(self.canvas_app, circle)
            self.history.execute_command(command)

    def add_rectangle(self):
        x = simpledialog.askinteger("Ввод", "Введите x:")
        y = simpledialog.askinteger("Ввод", "Введите y:")
        width = simpledialog.askinteger("Ввод", "Введите ширину:")
        height = simpledialog.askinteger("Ввод", "Введите высоту:")
        color = simpledialog.askstring("Ввод", "Введите цвет:")
        if x and y and width and height and color:
            rectangle = Rectangle(x, y, width, height, color)
            command = AddShapeCommand(self.canvas_app, rectangle)
            self.history.execute_command(command)

    def add_line(self):
        x1 = simpledialog.askinteger("Ввод", "Введите x1:")
        y1 = simpledialog.askinteger("Ввод", "Введите y1:")
        x2 = simpledialog.askinteger("Ввод", "Введите x2:")
        y2 = simpledialog.askinteger("Ввод", "Введите y2:")
        color = simpledialog.askstring("Ввод", "Введите цвет:")
        if x1 and y1 and x2 and y2 and color:
            line = Line(x1, y1, x2, y2, color)
            command = AddShapeCommand(self.canvas_app, line)
            self.history.execute_command(command)

    def erase_shape(self):
        shape_id = simpledialog.askinteger("Ввод", "Введите ID фигуры для удаления:")
        if shape_id:
            command = EraseShapeCommand(self.canvas_app, shape_id)
            self.history.execute_command(command)

    def move_shape(self):
        shape_id = simpledialog.askinteger("Ввод", "Введите ID фигуры для перемещения:")
        new_x = simpledialog.askinteger("Ввод", "Введите новый x:")
        new_y = simpledialog.askinteger("Ввод", "Введите новый y:")
        if shape_id and new_x and new_y:
            command = MoveShapeCommand(self.canvas_app, shape_id, new_x, new_y)
            self.history.execute_command(command)

    def set_background(self):
        color = simpledialog.askstring("Ввод", "Введите цвет фона:")
        if color:
            command = SetBackgroundCommand(self.canvas_app, color)
            self.history.execute_command(command)

    def save_canvas(self):
        filename = simpledialog.askstring("Ввод", "Введите имя файла для сохранения:")
        if filename:
            with open(filename, "w") as f:
                json.dump(self.canvas_app.to_dict(), f)
            messagebox.showinfo("Информация", f"Холст сохранен в файл {filename}")

    def load_canvas(self):
        filename = simpledialog.askstring("Ввод", "Введите имя файла для загрузки:")
        if filename:
            with open(filename, "r") as f:
                data = json.load(f)
                self.canvas_app = CanvasApp.from_dict(data, self.master)
            messagebox.showinfo("Информация", f"Холст загружен из файла {filename}")
            
    def undo(self):
        self.history.undo()

    def redo(self):
        self.history.redo()
    
if __name__ == "__main__":
    root = tk.Tk()
    app = PaintApp(root)
    root.mainloop()

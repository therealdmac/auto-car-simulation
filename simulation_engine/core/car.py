DIRS = ['N', 'E', 'S', 'W']
MOVE = {'N': (0, 1), 'E': (1, 0), 'S': (0, -1), 'W': (-1, 0)}

class Car:
    def __init__(self, name, position):
        self.name = name
        self.x, self.y, self.d = position
        self.history = [(self.x, self.y)]

    def command(self, c, width, height):
        if c == 'L':
            self.d = DIRS[(DIRS.index(self.d) - 1) % 4]
        elif c == 'R':
            self.d = DIRS[(DIRS.index(self.d) + 1) % 4]
        elif c == 'F':
            dx, dy = MOVE[self.d]
            nx, ny = self.x + dx, self.y + dy
            if 0 <= nx < width and 0 <= ny < height:
                self.x, self.y = nx, ny
        self.history.append((self.x, self.y))

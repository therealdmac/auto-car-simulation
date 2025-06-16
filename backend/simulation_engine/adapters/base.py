class AbstractCollisionAdapter:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def insert(self, car_id, x, y):
        raise NotImplementedError

    def move(self, car_id, x, y):
        raise NotImplementedError

    def check_collision(self, x, y):
        raise NotImplementedError

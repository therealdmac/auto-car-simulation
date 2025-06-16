from .base import AbstractCollisionAdapter

class NaiveAdapter(AbstractCollisionAdapter):
    def __init__(self, width, height):
        super().__init__(width, height)
        self.positions = {}

    def insert(self, car_id, x, y):
        self.positions[car_id] = (x, y)

    def move(self, car_id, x, y):
        self.positions[car_id] = (x, y)

    def check_collision(self, x, y):
        return [cid for cid, pos in self.positions.items() if pos == (x, y)]

from .base import AbstractCollisionAdapter
import pyqtree

class PyQTreeAdapter(AbstractCollisionAdapter):
    def __init__(self, width, height):
        super().__init__(width, height)
        self.index = pyqtree.Index(bbox=[0, 0, width, height])
        self.car_index = {}

    def insert(self, car_id, x, y):
        bbox = [x, y, x+1, y+1]
        self.car_index[car_id] = bbox
        self.index.insert(item=car_id, bbox=bbox)

    def move(self, car_id, x, y):
        if car_id in self.car_index:
            # pyqtree has no remove, so we reset index each move
            self.index = pyqtree.Index(bbox=[0, 0, self.width, self.height])
            for cid, box in self.car_index.items():
                if cid != car_id:
                    self.index.insert(cid, box)
        bbox = [x, y, x+1, y+1]
        self.car_index[car_id] = bbox
        self.index.insert(item=car_id, bbox=bbox)

    def check_collision(self, x, y):
        return self.index.intersect([x, y, x+1, y+1])

from time import time
from simulation_engine.adapters.naive import NaiveAdapter
from simulation_engine.adapters.pyqtree_adapter import PyQTreeAdapter
from simulation_engine.core.car import Car

def simulate(field, cars, adapter_cls):
    width, height = field
    adapter = adapter_cls(width, height)
    car_objs = {name: Car(name, pos) for name, pos, _ in cars}
    commands = {name: cmd for name, _, cmd in cars}
    collisions = []

    for cid, car in car_objs.items():
        adapter.insert(cid, car.x, car.y)

    for step in range(max(len(c) for c in commands.values())):
        positions_this_step = {}
        for cid in car_objs:
            car = car_objs[cid]
            if step < len(commands[cid]):
                car.command(commands[cid][step], width, height)
            adapter.move(cid, car.x, car.y)
            key = (car.x, car.y)
            positions_this_step.setdefault(key, []).append(cid)

        for (x, y), ids in positions_this_step.items():
            if len(ids) > 1:
                collisions.append((*ids[:2], x, y, step + 1))
    return {
        "collisions": collisions,
        "cars": {cid: {"history": car.history, "final": (car.x, car.y, car.d)} for cid, car in car_objs.items()}
    }

def run_all_adapters(field, cars):
    results = {}
    benchmarks = []

    for name, adapter in {"naive": NaiveAdapter, "pyqtree": PyQTreeAdapter}.items():
        start = time()
        sim_result = simulate(field, cars, adapter)
        duration = round(time() - start, 4)
        benchmarks.append({"adapter": name, "benchmark_seconds": duration})
        results[name] = sim_result

    fastest = min(benchmarks, key=lambda x: x["benchmark_seconds"])['adapter']
    return {
        "comparison_summary": {"results": benchmarks, "fastest": fastest},
        "detailed_results": results
    }

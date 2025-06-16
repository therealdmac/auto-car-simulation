from simulation_engine.core.simulator import run_all_adapters

def test_simulator():
    cars = [
        ("A", (1, 2, 'N'), "FFRFFFFRRL"),
        ("B", (7, 8, 'W'), "FFLFFFFFFF")
    ]
    field = (10, 10)
    results = run_all_adapters(field, cars)
    assert 'naive' in results['detailed_results']
    assert 'pyqtree' in results['detailed_results']

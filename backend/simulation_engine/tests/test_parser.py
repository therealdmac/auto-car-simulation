from simulation_engine.core.parser import parse_text_input

def test_parser():
    raw = """10 10

A
1 2 N
FFRFFFFRRL

B
7 8 W
FFLFFFFFFF"""
    field, cars = parse_text_input(raw)
    assert field == (10, 10)
    assert len(cars) == 2
    assert cars[0][0] == 'A'
    assert cars[1][2] == 'FFLFFFFFFF'

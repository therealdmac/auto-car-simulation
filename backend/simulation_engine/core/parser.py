def parse_text_input(text: str):
    lines = [line.strip() for line in text.strip().splitlines() if line.strip()]
    width, height = map(int, lines[0].split())
    cars = []
    i = 1
    while i < len(lines):
        name = lines[i]
        x, y, d = lines[i + 1].split()
        commands = lines[i + 2]
        cars.append((name, (int(x), int(y), d), commands))
        i += 3
    return (width, height), cars

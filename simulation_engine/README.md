
# Auto Driving Car Simulator (Backend)

This is the Python backend for the Auto Driving Car Simulation project, implemented using **FastAPI** and structured according to **SOLID OOP principles**. It supports multiple spatial collision detection adapters, car simulation, and benchmarking.

---

## 🚀 Features

- Single & Multi-car simulation
- Step-by-step car movement tracking
- Collision detection and history recording
- Benchmark comparison of spatial indexing adapters:
  - NaiveAdapter (brute-force)
  - PyQTreeAdapter (quadtree spatial index)
- REST API for simulation
- Unit tests and modular architecture

---

## 🗂 Project Structure

```
simulation_engine/
├── adapters/         # Collision adapter interfaces
├── core/             # Core logic (car, simulator, parser, logging)
├── tests/            # Unit tests
└── main.py           # FastAPI app entry point
```

---

## 🔧 Setup

### Requirements
- Python 3.9+
- pip

### Installation

```bash
pip install -r simulation_engine/requirements.txt
uvicorn simulation_engine.main:app --reload
```

---

## 🔌 API

### POST `/simulate`

**Input:**
```json
{
  "input": "10 10\n\nA\n1 2 N\nFFRFFFFRRL\n\nB\n7 8 W\nFFLFFFFFFF"
}
```

**Output:**
```json
{
  "comparison_summary": {
    "results": [{"adapter": "naive", "benchmark_seconds": 0.01}, ...],
    "fastest": "naive"
  },
  "detailed_results": {
    "naive": {
      "collisions": [...],
      "cars": {
        "A": {
          "history": [[1,2], [1,3], ...],
          "final": [4,3,"S"]
        }
      }
    },
    ...
  }
}
```

---

## 🧪 Testing

```bash
pytest
```

---

## 📁 License

MIT

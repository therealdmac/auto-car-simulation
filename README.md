# 🚗 Auto Car Simulation

A fullstack web app that simulates multiple self-driving cars on a 2D grid. It detects collisions, visualizes car movement step-by-step, benchmarks different spatial indexing strategies (e.g., BruteForce, QuadTree, PyQTree), and provides an elegant React + Tailwind dashboard.

---

## 🧩 Features

### ✅ Simulation Core (Python FastAPI)
- Simulate cars on a 2D rectangular grid with commands `F`, `L`, `R`
- Prevent out-of-bound moves and resolve multiple car collisions
- Support for multiple adapters:
  - `BruteForceAdapter`
  - `PyQTreeAdapter`
- Benchmarking and collision history per car
- REST API with Swagger documentation

### ✅ Frontend UI (React + Tailwind + Recharts)
- Upload or type command input in simulator format
- Visualize:
  - Simulation grid with car positions
  - Collisions (with red pin icons)
  - Benchmark bar chart of adapter performance
- Step-by-step simulation playback
- Adapter selection dropdown

---

## 📁 Project Structure

```
.
├── frontend/                   # React app
├── backend/simulation_engine/  # FastAPI backend
│   ├── adapters/               # BruteForce, PyQTree
│   ├── core/                   # Parser, simulation engine
│   ├── main.py                 # Entry point for API
│   └── config.py               # Pydantic settings with .env support
├── tests/                      # Unit tests
└── README.md
```

---

## 🚀 Running in Development

### Backend

```bash
cd simulation_engine
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn simulation_engine.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: [http://localhost:5173](http://localhost:5173)  
Backend: [http://localhost:8000](http://localhost:8000)  
Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Production Deployment (e.g., Railway)

### 1. Backend
Deploy `simulation_engine` as a FastAPI web service.
Set `ENV=production` environment variable.

**Expected CORS origin in `.env.production`:**
```
CORS_ORIGINS=["https://auto-car-frontend-production.up.railway.app"]
```

### 2. Frontend
```bash
npm run build
```
Deploy `dist/` to static host (e.g., Railway, Netlify, Vercel).

---

## 🧪 Sample Input

```
10 10

A
1 2 N
FFRFFFFRRL

B
7 8 W
FFLFFFFFFF
```

## 📬 API Usage

### `POST /simulate`

Request:
```json
{ "input": "10 10\n\nA\n1 2 N\nFFRFFFFRRL\n\nB\n7 8 W\nFFLFFFFFFF" }
```

Response includes:
- Per-adapter results
- Benchmark summary
- Car movement histories
- Collision steps

---

## 🧪 Testing

```bash
pytest
```

---

## 📄 License

MIT © [Daryl McIntyre](https://github.com/therealdmac)

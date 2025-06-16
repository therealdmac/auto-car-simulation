
# Auto Driving Car Simulator (Frontend)

This is the React-based frontend UI for the Auto Driving Car Simulation project. It provides an interactive dashboard to input simulation data, visualize car movement, detect collisions, and compare adapter performance.

---

## ⚙️ Features

- Text input for grid and car instructions
- Playback step-by-step car movement
- Collision heatmap and step indicators
- Adapter selector to view different backend implementations
- Bar chart to benchmark performance of each adapter
- FastAPI-compatible request handling

---

## 📦 Tech Stack

- React + Vite
- Tailwind CSS
- Recharts (for charts)
- Lucide React (icons)

---

## 🏗 Project Structure

```
frontend/
├── SimulationDashboard.jsx     # Main UI
├── vite.config.js              # Vite build config
├── package.json                # Dependencies & scripts
```

---

## 🚀 Setup

### Requirements
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

This starts the development server at `http://localhost:5173/`.

---

## 🔁 Usage

1. Copy and paste simulation input (e.g.)
    ```
    10 10

    A
    1 2 N
    FFRFFFFRRL

    B
    7 8 W
    FFLFFFFFFF
    ```
2. Click **Simulate**
3. Use play/pause to animate
4. Switch adapters and compare benchmark performance

---

## 🧪 Testing

> Currently no test cases; consider adding Cypress or React Testing Library.

---

## 📁 License

MIT

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Play, Pause } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-soft p-6 text-gray-700 ${className}`}>{children}</div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`bg-gradient-to-tr from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none transition duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

function AdapterSelector({ adapters, selected, onChange }) {
  return (
    <select value={selected} onChange={onChange} className="bg-white border border-gray-300 text-sm p-2 rounded-lg shadow-sm">
      {Object.keys(adapters).map((adapter) => (
        <option key={adapter} value={adapter}>{adapter}</option>
      ))}
    </select>
  );
}

function BenchmarkChart({ results, fastest }) {
  return (
    <Card className="mb-6">
      <h2 className="text-xl font-bold mb-4">Benchmark Summary</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={results}>
          <XAxis dataKey="adapter" stroke="#8884d8" />
          <YAxis stroke="#8884d8" />
          <Tooltip />
          <Bar dataKey="benchmark_seconds" fill="#5e72e4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-4 text-sm">Fastest: <strong>{fastest}</strong></p>
    </Card>
  );
}

function CollisionGrid({ gridSize, cars, collisions, step }) {
  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Collision Map & Playback</h2>
      <div className="grid border rounded overflow-hidden" style={{ gridTemplateColumns: `repeat(${gridSize.width}, 1fr)` }}>
        {[...Array(gridSize.height)].map((_, row) => (
          [...Array(gridSize.width)].map((_, col) => {
            const carsHere = Object.entries(cars).filter(
              ([id, car]) => car.history[step]?.[0] === col && car.history[step]?.[1] === gridSize.height - 1 - row
            );
            const collisionsHere = collisions.filter(
              c => c[2] === col && c[3] === gridSize.height - 1 - row && c[4] === step + 1
            );
            const bgColor = collisionsHere.length ? "bg-red-500" : carsHere.length ? "bg-gradient-to-br from-cyan-400 to-blue-600 text-white" : "bg-gray-100";

            return (
              <div
                key={`${row}-${col}`}
                className={`w-6 h-6 flex items-center justify-center text-xs ${bgColor} border border-white`}
                title={carsHere.map(c => c[0]).join(", ") || ""}
              >
                {collisionsHere.length ? <MapPin size={12} /> : carsHere.map(c => c[0]).join("")}
              </div>
            );
          })
        ))}
      </div>
    </Card>
  );
}

export default function SimulationDashboard() {
  const [data, setData] = useState(null);
  const [inputText, setInputText] = useState("10 10\n\nA\n1 2 N\nFFRFFFFRRL\n\nB\n7 8 W\nFFLFFFFFFF");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gridSize, setGridSize] = useState({ width: 10, height: 10 });
  const [selectedAdapter, setSelectedAdapter] = useState("pyqtree");

  const runSimulation = async () => {
    const res = await fetch("/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: inputText })
    });
    const json = await res.json();
    const [width, height] = inputText.split("\n")[0].trim().split(" ").map(Number);
    setGridSize({ width, height });
    setStep(0);
    setData(json);
  };

  useEffect(() => {
    if (!playing || !data) return;
    const interval = setInterval(() => {
      setStep((s) => {
        const maxSteps = Math.max(...Object.values(data.detailed_results[selectedAdapter].cars).map(c => c.history.length));
        return s < maxSteps - 1 ? s + 1 : s;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [playing, data, selectedAdapter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 font-sans">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full h-40 p-4 rounded-xl border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="flex flex-wrap gap-4 items-center">
        <Button onClick={runSimulation}>Simulate</Button>
        {data && (
          <>
            <Button onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <span className="text-sm">Step: <strong>{step}</strong></span>
            <AdapterSelector adapters={data.detailed_results} selected={selectedAdapter} onChange={(e) => setSelectedAdapter(e.target.value)} />
          </>
        )}
      </div>

      {data && (
        <>
          <BenchmarkChart results={data.comparison_summary.results} fastest={data.comparison_summary.fastest} />
          <CollisionGrid
            gridSize={gridSize}
            cars={data.detailed_results[selectedAdapter].cars}
            collisions={data.detailed_results[selectedAdapter].collisions}
            step={step}
          />
        </>
      )}
    </div>
  );
}

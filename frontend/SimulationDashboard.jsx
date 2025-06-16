import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Play, Pause } from "lucide-react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

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

function getDirectionIcon(direction) {
  const iconProps = { className: "w-full h-full" };
  switch (direction) {
    case "N": return <ArrowUp {...iconProps} />;
    case "S": return <ArrowDown {...iconProps} />;
    case "E": return <ArrowRight {...iconProps} />;
    case "W": return <ArrowLeft {...iconProps} />;
    default: return null;
  }
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
  const carColors = Object.keys(cars).reduce((acc, id, i) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-yellow-500"];
    acc[id] = colors[i % colors.length];
    return acc;
  }, {});

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Collision Map & Playback</h2>
      <div className="relative w-full aspect-square mx-auto border rounded overflow-hidden shadow">
        <div
          className="grid w-full h-full"
          style={{ gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))` }}
        >
          {[...Array(gridSize.height)].map((_, row) => (
            [...Array(gridSize.width)].map((_, col) => {
              const carsHere = Object.entries(cars).filter(
                ([id, car]) => car.history[step]?.[0] === col && car.history[step]?.[1] === gridSize.height - 1 - row
              );
              const collisionsHere = collisions.filter(
                c => c[2] === col && c[3] === gridSize.height - 1 - row && c[4] === step + 1
              );
              const bgColor = collisionsHere.length
                ? "bg-red-500"
                : carsHere.length
                  ? carColors[carsHere[0][0]] || "bg-gray-400"
                  : "bg-gray-100";

              return (
                <div
                  key={`${row}-${col}`}
                  className={`w-full h-full flex items-center justify-center text-xs ${bgColor} border border-white`}
                  title={carsHere.map(c => c[0]).join(", ") || ""}
                >
                  {collisionsHere.length
                    ? <MapPin size={12} />
                    : carsHere.length ? getDirectionIcon(carsHere[0][1]?.history[step]?.[2]) : null}
                </div>
              );
            })
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {Object.keys(cars).map((id) => (
          <div key={id} className="flex items-center gap-2">
            <span className={`w-4 h-4 inline-block rounded ${carColors[id]}`}></span>
            <span>{id}</span>
          </div>
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
    const res = await fetch(`${__API_URL__}/simulate`, {
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
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen space-y-6 font-sans max-w-screen-xl mx-auto">
      <div className="text-center space-y-2 px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Auto Car Collision Simulator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Visualize multiple car paths on a shared grid and detect collisions using different spatial indexing adapters.
        </p>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 max-w-2xl mx-auto text-left text-sm">
          <h2 className="font-semibold mb-1">Instructions:</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Input format: Grid size followed by each car's name, start position/direction, and commands.</li>
            <li>Example:
              <pre className="bg-white text-gray-800 p-2 mt-1 rounded border border-gray-300 overflow-auto">
10 10

A
1 2 N
FFRFFFFRRL

B
7 8 W
FFLFFFFFFF
              </pre>
            </li>
            <li>Click <strong>Simulate</strong> to start, then <strong>Play/Pause</strong> to animate the steps.</li>
          </ul>
        </div>
      </div>

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

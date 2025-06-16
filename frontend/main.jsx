import React from 'react';
import ReactDOM from 'react-dom/client';
import SimulationDashboard from './SimulationDashboard.jsx';
import './index.css'; // ✅ import Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimulationDashboard />
  </React.StrictMode>
);

import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio.jsx";
import Admin from "./pages/Admin.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian font-sans text-slate-200 antialiased">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="*" element={<Portfolio />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

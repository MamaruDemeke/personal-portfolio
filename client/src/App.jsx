import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio.jsx";

// Admin + Firebase dashboard code is only fetched when /admin is visited,
// so portfolio visitors never download it.
const Admin = lazy(() => import("./pages/Admin.jsx"));

export default function App() {
  return (
    <div className="min-h-screen bg-obsidian font-sans text-slate-200 antialiased">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="*" element={<Portfolio />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <p className="flex min-h-screen items-center justify-center font-mono text-sm text-slate-500">
                  loading dashboard…
                </p>
              }
            >
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

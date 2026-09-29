import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useAuth } from "../hooks/useAuth.js";
import { auth } from "../firebase.js";
import AdminDashboard from "../components/admin/AdminDashboard.jsx";
import Icon from "../components/Icon.jsx";

export default function Admin() {
  const { user, authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!auth) {
      setError("Admin is disabled — Firebase is not configured on this deployment.");
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(
        err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
          ? "Invalid email or password."
          : err.code === "auth/too-many-requests"
            ? "Too many attempts. Try again later."
            : err.message
      );
    } finally {
      setBusy(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center font-mono text-slate-500">
        loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleLogin} className="glass-card w-full max-w-sm space-y-5 p-8">
          <div className="text-center">
            <h1 className="font-mono text-2xl font-bold text-white">
              <span className="text-accent">admin</span>_
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Restricted area — sign in to continue.
            </p>
          </div>

          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
          <a
            href="/"
            className="block text-center text-sm text-slate-500 hover:text-accent"
          >
            ← Back to portfolio
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-obsidian/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="font-mono text-lg font-bold text-white">
            <span className="text-accent">admin</span>_
          </a>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.email}
            </span>
            <a href="/" className="text-sm text-slate-400 hover:text-accent">
              View site
            </a>
            <button
              onClick={() => signOut(auth)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
            >
              <Icon name="logout" className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <AdminDashboard />
    </div>
  );
}

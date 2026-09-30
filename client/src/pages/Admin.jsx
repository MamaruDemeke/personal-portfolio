import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
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
  const [mode, setMode] = useState("login"); // "login" | "reset"
  const [resetSent, setResetSent] = useState(false);

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

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!auth) {
      setError("Admin is disabled — Firebase is not configured on this deployment.");
      return;
    }
    setBusy(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err) {
      setError(
        err.code === "auth/user-not-found"
          ? "No admin account exists with that email."
          : err.code === "auth/invalid-email"
            ? "Enter a valid email address."
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
        <form
          onSubmit={mode === "login" ? handleLogin : handleReset}
          className="glass-card w-full max-w-sm space-y-5 p-8"
        >
          <div className="text-center">
            <h1 className="font-mono text-2xl font-bold text-white">
              <span className="text-accent">admin</span>_
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {mode === "login"
                ? "Restricted area — sign in to continue."
                : "Enter your admin email — we'll send a reset link."}
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
          {mode === "login" && (
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
          )}

          {resetSent && mode === "reset" && (
            <p className="rounded-lg bg-accent/10 px-4 py-2.5 text-sm text-accent">
              Reset link sent to <strong>{email}</strong>. Check your inbox
              (and spam folder) — the link opens a page to set a new password.
            </p>
          )}

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
            {busy
              ? "Working…"
              : mode === "login"
                ? "Sign In"
                : "Send Reset Link"}
          </button>

          <div className="flex items-center justify-between text-sm">
            {mode === "login" ? (
              <button
                type="button"
                onClick={() => {
                  setMode("reset");
                  setError("");
                  setResetSent(false);
                }}
                className="text-slate-500 hover:text-accent"
              >
                Forgot password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setResetSent(false);
                }}
                className="text-slate-500 hover:text-accent"
              >
                ← Back to sign in
              </button>
            )}
            <a href="/" className="text-slate-500 hover:text-accent">
              Portfolio →
            </a>
          </div>
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

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase.js";
import Icon from "../Icon.jsx";

const EMPTY = {
  title: "",
  category: "Web App",
  description: "",
  tech: "",
  repoUrl: "",
  liveUrl: "",
  featured: false,
};

export default function ProjectForm({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial
      ? { ...EMPTY, ...initial, tech: (initial.tech || []).join(", ") }
      : EMPTY
  );
  const [imageFile, setImageFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      let imageUrl = form.imageUrl || "";
      if (imageFile) {
        const path = `projects/${Date.now()}-${imageFile.name}`;
        const snap = await uploadBytes(ref(storage, path), imageFile);
        imageUrl = await getDownloadURL(snap.ref);
      }
      await onSave({
        ...form,
        tech: form.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        imageUrl,
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <motion.form
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="glass-card max-h-[88vh] w-full max-w-lg space-y-4 overflow-y-auto p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {initial ? "Edit Project" : "New Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-accent"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div>
          <label htmlFor="p-title" className="mb-1.5 block text-sm text-slate-300">Title</label>
          <input id="p-title" name="title" required value={form.title} onChange={onChange} className="input-field" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-category" className="mb-1.5 block text-sm text-slate-300">Category</label>
            <select id="p-category" name="category" value={form.category} onChange={onChange} className="input-field">
              {["Web App", "E-Commerce", "Mobile", "Backend", "Other"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="p-tech" className="mb-1.5 block text-sm text-slate-300">
              Tech <span className="text-slate-500">(comma separated)</span>
            </label>
            <input id="p-tech" name="tech" value={form.tech} onChange={onChange} className="input-field" placeholder="React, Firebase, Tailwind" />
          </div>
        </div>

        <div>
          <label htmlFor="p-desc" className="mb-1.5 block text-sm text-slate-300">Description</label>
          <textarea id="p-desc" name="description" required rows={4} value={form.description} onChange={onChange} className="input-field resize-y" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="p-repo" className="mb-1.5 block text-sm text-slate-300">Repo URL</label>
            <input id="p-repo" name="repoUrl" type="url" value={form.repoUrl} onChange={onChange} className="input-field" />
          </div>
          <div>
            <label htmlFor="p-live" className="mb-1.5 block text-sm text-slate-300">Live URL</label>
            <input id="p-live" name="liveUrl" type="url" value={form.liveUrl} onChange={onChange} className="input-field" />
          </div>
        </div>

        <div>
          <label htmlFor="p-image" className="mb-1.5 block text-sm text-slate-300">
            Cover image <span className="text-slate-500">(stored in Firebase Storage)</span>
          </label>
          <input
            id="p-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent/15 file:px-4 file:py-2 file:text-sm file:text-accent"
          />
          {form.imageUrl && !imageFile && (
            <img src={form.imageUrl} alt="Current cover" className="mt-3 h-28 rounded-lg object-cover" />
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={onChange}
            className="h-4 w-4 accent-emerald-500"
          />
          Mark as featured
        </label>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline !px-5 !py-2.5 text-sm">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60">
            {busy ? "Saving…" : "Save Project"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}

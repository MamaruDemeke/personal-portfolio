import { useState } from "react";
import { motion } from "framer-motion";
import {
  TextInput,
  TextArea,
  SelectInput,
  ImageUploadField,
} from "./fields.jsx";
import Icon from "../Icon.jsx";

const EMPTY = {
  title: "",
  category: "",
  description: "",
  tech: "",
  repoUrl: "",
  liveUrl: "",
  featured: false,
  imageUrl: "",
};

export default function ProjectForm({ initial, categories = [], onClose, onSave }) {
  const [form, setForm] = useState(
    initial
      ? { ...EMPTY, ...initial, tech: (initial.tech || []).join(", ") }
      : { ...EMPTY, category: categories[0] || "Web" }
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSave({
        ...form,
        tech: form.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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

        <TextInput label="Title" value={form.title} onChange={set("title")} required />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectInput
            label="Category"
            value={form.category}
            onChange={set("category")}
            options={categories}
            hint="Managed in Content → Projects"
          />
          <TextInput
            label="Tech (comma separated)"
            value={form.tech}
            onChange={set("tech")}
            placeholder="React, Firebase, Tailwind"
          />
        </div>

        <TextArea
          label="Description"
          value={form.description}
          onChange={set("description")}
          rows={4}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Repo URL"
            value={form.repoUrl}
            onChange={set("repoUrl")}
            placeholder="https://github.com/…"
          />
          <TextInput
            label="Live URL"
            value={form.liveUrl}
            onChange={set("liveUrl")}
            placeholder="https://…"
          />
        </div>

        <ImageUploadField
          label="Cover image"
          currentUrl={form.imageUrl}
          aspect="aspect-video"
          maxMB={5}
          hint="Compressed in your browser before upload (max 5 MB)."
          storagePath={(f) =>
            `projects/cover-${Date.now()}.${
              f.type === "image/png"
                ? "png"
                : f.type === "image/webp"
                  ? "webp"
                  : "jpg"
            }`
          }
          onUploaded={set("imageUrl")}
          onCleared={() => set("imageUrl")("")}
        />

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) =>
              setForm((f) => ({ ...f, featured: e.target.checked }))
            }
            className="h-4 w-4 accent-emerald-500"
          />
          Mark as featured
        </label>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline !px-5 !py-2.5 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="btn-primary !px-5 !py-2.5 text-sm disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save Project"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
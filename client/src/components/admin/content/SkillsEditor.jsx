import { useEffect, useState } from "react";
import { Card, TextInput, toList } from "../fields.jsx";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EMPTY = { id: "", title: "New Category", skills: [] };

export default function SkillsEditor({ content, update }) {
  const skills = content.skills || [];
  const [justAdded, setJustAdded] = useState(null);
  const setSkills = (next) => update(next);

  /* New categories are inserted at the top, right under the "+ Add category"
     button — scroll them into view and focus the title field so adding is
     instant. */
  useEffect(() => {
    if (!justAdded) return undefined;
    document
      .getElementById(`skill-card-${justAdded}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById(`skill-title-${justAdded}`)?.focus();
    return () => {};
  }, [justAdded]);

  const add = () => {
    const item = { ...EMPTY, id: newId() };
    setJustAdded(item.id);
    setSkills([item, ...skills]);
  };
  const remove = (i) => setSkills(skills.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= skills.length) return;
    const next = [...skills];
    [next[i], next[j]] = [next[j], next[i]];
    setSkills(next);
  };
  const patch = (i, field, value) =>
    setSkills(skills.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {skills.length} categor{skills.length === 1 ? "y" : "ies"} — these also
          drive the scrolling tech marquee.
        </p>
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
        >
          + Add category
        </button>
      </div>

      {skills.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
          No skill categories yet.
        </p>
      )}

      {skills.map((cat, i) => (
        <div key={cat.id || i} id={`skill-card-${cat.id}`}>
        <Card>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextInput
                id={`skill-title-${cat.id}`}
                label="Category title"
                value={cat.title}
                autoFocus={justAdded === cat.id}
                onChange={(v) => patch(i, "title", v)}
              />
            </div>
            <div className="flex gap-2 pb-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded-lg border border-white/10 px-2.5 py-2 text-slate-400 hover:border-accent/50 hover:text-accent"
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded-lg border border-white/10 px-2.5 py-2 text-slate-400 hover:border-accent/50 hover:text-accent"
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="rounded-lg border border-white/10 px-2.5 py-2 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                aria-label="Remove category"
              >
                ✕
              </button>
            </div>
          </div>
          <TextInput
            label="Skills (comma separated)"
            value={toList(cat.skills).join(", ")}
            onChange={(v) => patch(i, "skills", toList(v))}
            placeholder="HTML, CSS, JavaScript"
          />
        </Card>
        </div>
      ))}
    </div>
  );
}
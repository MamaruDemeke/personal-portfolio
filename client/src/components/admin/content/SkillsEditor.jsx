import { useEffect, useState } from "react";
import { Card, TextInput, SelectInput } from "../fields.jsx";
import TechIcon, { TECH_LOGOS } from "../../TechIcon.jsx";
import { SKILL_LIBRARY } from "../../../data/constants.js";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `skill-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EMPTY = { id: "", title: "New Category", skills: [] };

/* Legacy editors stored plain strings — normalise to tiles { name, logo }. */
const toItem = (s) =>
  typeof s === "string" ? { id: newId(), name: s, logo: s } : s;

const LOGO_OPTIONS = TECH_LOGOS.map((l) => ({ value: l, label: l }));

/* Pick the library group that matches a category title, e.g.
   "Languages" / "Frameworks" / "DevOps" / "Cloud". */
function libraryGroupFor(title) {
  const t = String(title || "").toLowerCase();
  if (t.includes("language")) return "Languages";
  if (t.includes("framework") || t.includes("frame") || t.includes("react") || t.includes("ui")) {
    return "Frameworks";
  }
  if (t.includes("devops") || t.includes("dev ops") || t.includes("ci") || t.includes("ops")) {
    return "DevOps";
  }
  if (t.includes("cloud")) return "Cloud";
  return null;
}

export default function SkillsEditor({ content, update }) {
  const skills = content.skills || [];
  const [justAdded, setJustAdded] = useState(null);
  const [drafts, setDrafts] = useState({});
  const setSkills = (next) => update(next);

  /* Categories with every skill normalised to a tile object. */
  const cats = skills.map((c) => ({
    ...c,
    skills: (c.skills || []).map(toItem),
  }));

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

  /* ---- per-skill helpers ---- */
  const patchSkill = (i, si, field, value) =>
    setSkills(
      cats.map((c, idx) =>
        idx === i
          ? { ...c, skills: c.skills.map((s, sidx) => (sidx === si ? { ...s, [field]: value } : s)) }
          : c
      )
    );
  const moveSkill = (i, si, dir) => {
    const j = si + dir;
    if (j < 0 || j >= cats[i].skills.length) return;
    const next = cats.map((c, idx) => (idx === i ? { ...c, skills: [...c.skills] } : c));
    const row = next[i].skills;
    [row[si], row[j]] = [row[j], row[si]];
    setSkills(next);
  };
  const removeSkill = (i, si) =>
    setSkills(
      cats.map((c, idx) =>
        idx === i ? { ...c, skills: c.skills.filter((_, sidx) => sidx !== si) } : c
      )
    );
  const addSkill = (i) => {
    const d = drafts[i] || {};
    const name = (d.name || "").trim();
    if (!name) return;
    const item = { id: newId(), name, logo: (d.logo || "").trim() || name.toLowerCase() };
    setSkills(
      cats.map((c, idx) => (idx === i ? { ...c, skills: [...c.skills, item] } : c))
    );
    setDrafts({ ...drafts, [i]: { name: "", logo: d.logo || "" } });
  };
  const addLibrarySkill = (i, lib) => {
    const has = cats[i].skills.some(
      (s) => String(s.name).toLowerCase() === String(lib.name).toLowerCase()
    );
    if (has) return;
    setSkills(
      cats.map((c, idx) =>
        idx === i ? { ...c, skills: [...c.skills, { id: newId(), ...lib }] } : c
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {skills.length} categor{skills.length === 1 ? "y" : "ies"} — each skill is a
          logo + name tile. These also drive the scrolling tech marquee.
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

      {cats.map((cat, i) => (
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

            <div className="mt-3 space-y-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Skills ({cat.skills.length})
              </p>
              {cat.skills.length === 0 && (
                <p className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-slate-500">
                  No skills yet — add one below.
                </p>
              )}
              {cat.skills.map((s, si) => (
                <div
                  key={s.id || si}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-obsidian/40 px-2 py-1.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-surface">
                    <TechIcon name={s.logo || s.name} className="h-4 w-4" />
                  </span>
                  <SelectInput
                    value={s.logo || s.name.toLowerCase()}
                    onChange={(v) => patchSkill(i, si, "logo", v)}
                    options={LOGO_OPTIONS}
                  />
                  <TextInput
                    value={s.name}
                    onChange={(v) => patchSkill(i, si, "name", v)}
                    placeholder="Skill name"
                  />
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => moveSkill(i, si, -1)}
                      className="rounded-md border border-white/10 px-2 py-1 text-slate-400 hover:border-accent/50 hover:text-accent"
                      aria-label="Move skill up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSkill(i, si, 1)}
                      className="rounded-md border border-white/10 px-2 py-1 text-slate-400 hover:border-accent/50 hover:text-accent"
                      aria-label="Move skill down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSkill(i, si)}
                      className="rounded-md border border-white/10 px-2 py-1 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                      aria-label="Remove skill"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {libraryGroupFor(cat.title) && (
                <div className="rounded-lg border border-white/10 bg-surface/30 p-2.5">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Add from library — {libraryGroupFor(cat.title)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SKILL_LIBRARY[libraryGroupFor(cat.title)].map((lib) => {
                      const present = cat.skills.some(
                        (s) =>
                          String(s.name).toLowerCase() === String(lib.name).toLowerCase()
                      );
                      return (
                        <button
                          key={lib.logo}
                          type="button"
                          onClick={() => addLibrarySkill(i, lib)}
                          disabled={present}
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-obsidian/50 px-2 py-1 text-xs text-slate-300 transition-colors hover:border-accent/50 hover:text-white disabled:cursor-default disabled:opacity-40"
                        >
                          <TechIcon name={lib.logo} className="h-3.5 w-3.5" />
                          {lib.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <SelectInput
                  value={(drafts[i] || {}).logo || ""}
                  onChange={(v) => setDrafts({ ...drafts, [i]: { ...drafts[i], logo: v } })}
                  options={LOGO_OPTIONS}
                />
                <TextInput
                  value={(drafts[i] || {}).name || ""}
                  onChange={(v) => setDrafts({ ...drafts, [i]: { ...drafts[i], name: v } })}
                  placeholder="New skill name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(i);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addSkill(i)}
                  className="shrink-0 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-sm text-accent hover:bg-accent/20"
                >
                  + Add
                </button>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
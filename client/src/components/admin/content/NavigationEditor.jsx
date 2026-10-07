import { useEffect, useState } from "react";
import { Card, TextInput, Toggle } from "../fields.jsx";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `nav-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const LABELS = {
  marquee: "Tech marquee",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  certificates: "Certificates",
  projects: "Projects",
  contact: "Contact",
};

export default function NavigationEditor({ content, update }) {
  const links = content.navLinks || [];
  const sections = content.sections || {};
  const [justAdded, setJustAdded] = useState(null);

  /* New links are inserted at the top, right under the "+ Add link" button —
     scroll them into view and focus the label field so adding is instant. */
  useEffect(() => {
    if (!justAdded) return undefined;
    document
      .getElementById(`nav-card-${justAdded}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById(`nav-label-${justAdded}`)?.focus();
    return () => {};
  }, [justAdded]);

  const setLinks = (next) => update(next);
  const patchSection = (key, patch) =>
    update({ ...content.sections, [key]: { ...sections[key], ...patch } });

  const add = () => {
    const item = { label: "New link", href: "#", visible: true, id: newId() };
    setJustAdded(item.id);
    setLinks([item, ...links]);
  };
  const remove = (i) => setLinks(links.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    setLinks(next);
  };
  const patch = (i, field, value) =>
    setLinks(links.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Navbar links
          </h4>
          <button
            type="button"
            onClick={add}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            + Add link
          </button>
        </div>
        {links.length === 0 ? (
          <p className="text-sm text-slate-500">No navigation links.</p>
        ) : (
          <div className="space-y-3">
            {links.map((l, i) => (
              <div
                key={l.id || i}
                id={`nav-card-${l.id}`}
                className="rounded-xl border border-white/10 bg-obsidian/40 p-4"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-40">
                    <TextInput
                      id={`nav-label-${l.id}`}
                      label="Label"
                      value={l.label}
                      autoFocus={justAdded === l.id}
                      onChange={(v) => patch(i, "label", v)}
                    />
                  </div>
                  <div className="w-40">
                    <TextInput
                      label="Anchor"
                      value={l.href}
                      onChange={(v) => patch(i, "href", v)}
                      placeholder="#about"
                    />
                  </div>
                  <div className="flex-1 pb-1">
                    <Toggle
                      label="Show"
                      checked={l.visible !== false}
                      onChange={(v) => patch(i, "visible", v)}
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
                      aria-label="Remove link"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Section visibility &amp; headings
        </h4>
        <div className="space-y-3">
          {Object.keys(LABELS).map((key) => {
            const meta = sections[key] || {};
            const hasHeading = "title" in meta;
            return (
              <div key={key} className="rounded-xl border border-white/10 bg-obsidian/40 p-4">
                <Toggle
                  label={`Show “${LABELS[key]}”`}
                  checked={meta.visible !== false}
                  onChange={(v) => patchSection(key, { visible: v })}
                />
                {hasHeading && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <TextInput
                      label="Eyebrow"
                      value={meta.eyebrow || ""}
                      onChange={(v) => patchSection(key, { eyebrow: v })}
                    />
                    <TextInput
                      label="Title"
                      value={meta.title || ""}
                      onChange={(v) => patchSection(key, { title: v })}
                    />
                    <TextInput
                      label="Accent word"
                      value={meta.accent || ""}
                      onChange={(v) => patchSection(key, { accent: v })}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
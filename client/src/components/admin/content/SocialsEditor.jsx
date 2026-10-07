import { useEffect, useState } from "react";
import { Card, Grid, TextInput, SelectInput } from "../fields.jsx";
import { SOCIAL_ICONS } from "../../../data/constants.js";
import Icon from "../../Icon.jsx";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `soc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EMPTY = { id: "", label: "", href: "", icon: "link" };

export default function SocialsEditor({ content, update }) {
  const socials = content.socials || [];
  const [justAdded, setJustAdded] = useState(null);

  /* New links are inserted at the top, right under the "+ Add link" button —
     scroll them into view and focus the label field so adding is instant. */
  useEffect(() => {
    if (!justAdded) return undefined;
    document
      .getElementById(`social-card-${justAdded}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById(`social-label-${justAdded}`)?.focus();
    return () => {};
  }, [justAdded]);

  const add = () => {
    const item = { ...EMPTY, id: newId() };
    setJustAdded(item.id);
    update([item, ...socials]);
  };
  const remove = (i) => update(socials.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= socials.length) return;
    const next = [...socials];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const patch = (i, field, value) =>
    update(socials.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          These appear under your name in the hero and in the footer.
        </p>
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
        >
          + Add link
        </button>
      </div>

      {socials.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
          No social links yet.
        </p>
      )}

      {socials.map((s, i) => (
        <div key={s.id || i} id={`social-card-${s.id}`}>
        <Card>
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Icon name={s.icon} className="h-4 w-4" />
            </span>
            <div className="flex gap-2">
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
          <Grid cols={3}>
            <TextInput
              id={`social-label-${s.id}`}
              label="Label"
              value={s.label}
              autoFocus={justAdded === s.id}
              onChange={(v) => patch(i, "label", v)}
              placeholder="GitHub"
            />
            <TextInput
              label="URL"
              value={s.href}
              onChange={(v) => patch(i, "href", v)}
              placeholder="https://github.com/username"
            />
            <SelectInput
              label="Icon"
              value={s.icon}
              onChange={(v) => patch(i, "icon", v)}
              options={SOCIAL_ICONS.map((ic) => ({ value: ic, label: ic }))}
            />
          </Grid>
        </Card>
        </div>
      ))}
    </div>
  );
}
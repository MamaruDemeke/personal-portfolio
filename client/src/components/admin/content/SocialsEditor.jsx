import { Card, Grid, TextInput, SelectInput } from "../fields.jsx";
import { SOCIAL_ICONS } from "../../../data/constants.js";
import Icon from "../../Icon.jsx";

const EMPTY = { label: "", href: "", icon: "link" };

export default function SocialsEditor({ content, update }) {
  const socials = content.socials || [];

  const add = () => update([...socials, { ...EMPTY }]);
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
        <Card key={i}>
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
              label="Label"
              value={s.label}
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
      ))}
    </div>
  );
}
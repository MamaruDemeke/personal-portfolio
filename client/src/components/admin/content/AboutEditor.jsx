import { Card, Grid, TextInput, TextArea, Toggle } from "../fields.jsx";

const EMPTY_STAT = { value: "", label: "" };

export default function AboutEditor({ content, update }) {
  const a = content.about;
  const setStats = (stats) => update({ stats });
  const setAvailability = (patch) =>
    update({ availability: { ...a.availability, ...patch } });

  const move = (i, dir) => {
    const next = [...a.stats];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setStats(next);
  };

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Heading
        </h4>
        <Grid cols={2}>
          <TextInput
            label="Greeting"
            value={a.greeting}
            onChange={(v) => update({ greeting: v })}
            placeholder="Hi, I'm"
          />
          <TextInput
            label="Highlighted words"
            value={a.headingAccent}
            onChange={(v) => update({ headingAccent: v })}
            placeholder="a builder of things"
          />
        </Grid>
        <TextArea
          label="Bio — one paragraph per line"
          value={(a.paragraphs || []).join("\n")}
          onChange={(v) =>
            update({
              paragraphs: v.split("\n").map((x) => x.trim()).filter(Boolean),
            })
          }
          rows={8}
        />
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Stats
          </h4>
          <button
            type="button"
            onClick={() => setStats([...a.stats, { ...EMPTY_STAT }])}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            + Add stat
          </button>
        </div>
        {a.stats.length === 0 ? (
          <p className="text-sm text-slate-500">No stats yet.</p>
        ) : (
          <div className="space-y-3">
            {a.stats.map((s, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3">
                <div className="w-28">
                  <TextInput
                    label="Value"
                    value={s.value}
                    onChange={(v) =>
                      setStats(
                        a.stats.map((x, idx) => (idx === i ? { ...x, value: v } : x))
                      )
                    }
                  />
                </div>
                <div className="flex-1">
                  <TextInput
                    label="Label"
                    value={s.label}
                    onChange={(v) =>
                      setStats(
                        a.stats.map((x, idx) => (idx === i ? { ...x, label: v } : x))
                      )
                    }
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
                    onClick={() => setStats(a.stats.filter((_, idx) => idx !== i))}
                    className="rounded-lg border border-white/10 px-2.5 py-2 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                    aria-label="Remove stat"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Small cards
        </h4>
        <Toggle
          label="Show the availability card"
          checked={a.availability?.enabled}
          onChange={(v) => setAvailability({ enabled: v })}
        />
        <Grid cols={2}>
          <TextInput
            label="Availability title"
            value={a.availability?.title}
            onChange={(v) => setAvailability({ title: v })}
          />
          <TextInput
            label="Availability text"
            value={a.availability?.text}
            onChange={(v) => setAvailability({ text: v })}
          />
        </Grid>
        <TextInput
          label="Location card note"
          value={a.locationNote}
          onChange={(v) => update({ locationNote: v })}
        />
      </Card>
    </div>
  );
}
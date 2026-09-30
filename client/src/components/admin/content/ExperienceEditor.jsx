import { Card, Grid, TextInput, TextArea, toList } from "../fields.jsx";

const EMPTY = {
  company: "",
  role: "",
  period: "",
  summary: "",
  highlights: [],
  tech: [],
};

export default function ExperienceEditor({ content, update }) {
  const jobs = content.experience || [];

  const add = () => update([...jobs, { ...EMPTY }]);
  const remove = (i) => update(jobs.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= jobs.length) return;
    const next = [...jobs];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const patch = (i, field, value) =>
    update(jobs.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Newest roles go at the top of the timeline.
        </p>
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
        >
          + Add role
        </button>
      </div>

      {jobs.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
          No roles yet.
        </p>
      )}

      {jobs.map((job, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-accent/70">
              0{i + 1}
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
                aria-label="Remove role"
              >
                ✕
              </button>
            </div>
          </div>
          <Grid cols={3}>
            <TextInput
              label="Company"
              value={job.company}
              onChange={(v) => patch(i, "company", v)}
            />
            <TextInput
              label="Role"
              value={job.role}
              onChange={(v) => patch(i, "role", v)}
            />
            <TextInput
              label="Period"
              value={job.period}
              onChange={(v) => patch(i, "period", v)}
              placeholder="2023 — Present"
            />
          </Grid>
          <TextArea
            label="Summary"
            rows={3}
            value={job.summary}
            onChange={(v) => patch(i, "summary", v)}
          />
          <TextArea
            label="Highlights (one per line)"
            rows={4}
            value={(job.highlights || []).join("\n")}
            onChange={(v) =>
              patch(
                i,
                "highlights",
                v.split("\n").map((x) => x.trim()).filter(Boolean)
              )
            }
          />
          <TextInput
            label="Tech (comma separated)"
            value={toList(job.tech).join(", ")}
            onChange={(v) => patch(i, "tech", toList(v))}
          />
        </Card>
      ))}
    </div>
  );
}
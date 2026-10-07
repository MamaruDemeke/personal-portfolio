import { Card, TextInput } from "../fields.jsx";

export default function ProjectsSettingsEditor({ content, update }) {
  const categories = content.projectCategories || [];

  const add = () => {
    const v = window.prompt("Category name");
    const name = (v || "").trim();
    if (!name) return;
    update([name, ...categories]);
  };
  const remove = (i) => update(categories.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= categories.length) return;
    const next = [...categories];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const rename = (i, v) =>
    update(categories.map((c, idx) => (idx === i ? v : c)));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            Filter chips
          </h4>
          <button
            type="button"
            onClick={add}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            + Add category
          </button>
        </div>
        <p className="text-sm text-slate-400">
          The first chip is the default “show everything” filter. Keep “All” at
          the top.
        </p>
        {categories.length === 0 ? (
          <p className="text-sm text-slate-500">No categories — the filter bar hides.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((c, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3">
                <div className="flex-1">
                  <TextInput label={`Category ${i + 1}`} value={c} onChange={(v) => rename(i, v)} />
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
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Projects themselves
        </h4>
        <p className="text-sm text-slate-400">
          Each project is its own record — create, edit, reorder and delete them
          from the <strong className="text-slate-200">Projects</strong> tab. A
          project’s category must match one of the chips above for its filter to
          work.
        </p>
      </Card>
    </div>
  );
}
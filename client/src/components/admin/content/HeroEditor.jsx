import { Card, Grid, TextInput, Toggle, toList } from "../fields.jsx";

export default function HeroEditor({ content, update }) {
  const h = content.hero;

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Headline roles
        </h4>
        <TextInput
          label="Roles (comma separated)"
          value={toList(h.roles).join(", ")}
          onChange={(v) => update({ roles: toList(v) })}
          hint="Separated by a divider under your name — e.g. Web Developer, Video Editor"
        />
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Buttons
        </h4>
        <Grid cols={2}>
          <TextInput
            label="Primary button label"
            value={h.primaryCta}
            onChange={(v) => update({ primaryCta: v })}
          />
          <TextInput
            label="Primary button link"
            value={h.primaryHref}
            onChange={(v) => update({ primaryHref: v })}
            placeholder="#projects"
          />
          <TextInput
            label="Secondary button label"
            value={h.secondaryCta}
            onChange={(v) => update({ secondaryCta: v })}
          />
          <TextInput
            label="Secondary button link"
            value={h.secondaryHref}
            onChange={(v) => update({ secondaryHref: v })}
            placeholder="#contact"
          />
        </Grid>
        <TextInput
          label="CV button label"
          value={h.resumeCta}
          onChange={(v) => update({ resumeCta: v })}
        />
        <Toggle
          label="Show the CV download button"
          checked={h.showResume}
          onChange={(v) => update({ showResume: v })}
          hint="Turn off to hide it in the hero."
        />
      </Card>
    </div>
  );
}
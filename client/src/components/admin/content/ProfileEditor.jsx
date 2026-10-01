import { Card, Grid, TextInput, TextArea } from "../fields.jsx";

export default function ProfileEditor({ content, update }) {
  const p = content.profile;

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Identity
        </h4>
        <Grid cols={3}>
          <TextInput
            label="Brand mark"
            value={p.brand}
            onChange={(v) => update({ brand: v })}
            placeholder="MD."
          />
          <TextInput
            label="Full name"
            value={p.name}
            onChange={(v) => update({ name: v })}
          />
          <TextInput
            label="First name"
            value={p.firstName}
            onChange={(v) => update({ firstName: v })}
            hint="Used for the hero headline"
          />
          <TextInput
            label="Role / title"
            value={p.role}
            onChange={(v) => update({ role: v })}
          />
          <TextInput
            label="Location"
            value={p.location}
            onChange={(v) => update({ location: v })}
          />
          <TextInput
            label="Status pill"
            value={p.status}
            onChange={(v) => update({ status: v })}
            hint="Hero pill text, e.g. Open to new opportunities"
          />
        </Grid>
        <TextArea
          label="Tagline"
          value={p.tagline}
          onChange={(v) => update({ tagline: v })}
          rows={3}
        />
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Contact details
        </h4>
        <Grid cols={2}>
          <TextInput
            label="Email"
            type="email"
            value={p.email}
            onChange={(v) => update({ email: v })}
          />
          <TextInput
            label="Phone"
            value={p.phone}
            onChange={(v) => update({ phone: v })}
          />
          <TextInput
            label="Alternate phone"
            value={p.phoneAlt}
            onChange={(v) => update({ phoneAlt: v })}
          />
        </Grid>
        <TextInput
          label="Public site link"
          value={p.siteUrl || ""}
          onChange={(v) => update({ siteUrl: v })}
          placeholder="https://your-site.vercel.app"
          hint="Where the site is deployed — used for share links. Manage it under the Files tab."
        />
      </Card>
    </div>
  );
}
import {
  Card,
  Grid,
  TextInput,
  TextArea,
  UploadField,
  ImageUploadField,
  stamp,
} from "../fields.jsx";

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
      </Card>

      <Card>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          Files
        </h4>

        <UploadField
          label="CV / Resume"
          kind="pdf"
          accept="application/pdf"
          maxMB={10}
          hint="PDF only — this file backs the Download CV buttons."
          currentUrl={p.resumeUrl}
          storagePath={() => `cv/resume-${stamp("pdf")}`}
          onUploaded={(url) => update({ resumeUrl: url })}
          onCleared={() => update({ resumeUrl: "" })}
        />
        <TextInput
          label="…or paste a CV link"
          value={p.resumeUrl}
          onChange={(v) => update({ resumeUrl: v })}
          hint="Overrides the uploaded file if you set an external link."
        />

        <ImageUploadField
          label="Logo / avatar"
          currentUrl={p.logoUrl}
          storagePath={(f) => `profile/logo-${stamp(f.type === "image/png" ? "png" : "jpg")}`}
          onUploaded={(url) => update({ logoUrl: url })}
          onCleared={() => update({ logoUrl: "" })}
          hint="Shown in the navbar. Square images work best."
        />

        <ImageUploadField
          label="Favicon"
          currentUrl={p.faviconUrl}
          aspect="aspect-square"
          storagePath={(f) => `profile/favicon-${stamp(f.type === "image/png" ? "png" : "jpg")}`}
          onUploaded={(url) => update({ faviconUrl: url })}
          onCleared={() => update({ faviconUrl: "" })}
          hint="Small square image shown in the browser tab."
        />
      </Card>
    </div>
  );
}
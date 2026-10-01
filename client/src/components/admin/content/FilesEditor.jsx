import {
  Card,
  TextInput,
  UploadField,
  ImageUploadField,
  extFor,
  stamp,
} from "../fields.jsx";
import Icon from "../../Icon.jsx";

export default function FilesEditor({ content, update, persist }) {
  const p = content.profile;
  const store = (patch, message) =>
    persist
      ? persist({ ...content, profile: { ...content.profile, ...patch } }, message)
      : update(patch);

  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
        Uploads publish themselves — the link is written to Firestore the moment
        the file lands, so there is nothing else to save. If an upload is
        rejected with &ldquo;Storage rules blocked this upload&rdquo;, run{' '}
        <code className="font-mono">firebase deploy --only storage</code> once
        from the project root.
      </p>

      <Card>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon name="link" className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Public site link
            </h4>
            <p className="text-sm text-slate-400">
              Your Vercel / Firebase Hosting URL, used for share links.
            </p>
          </div>
        </div>

        <TextInput
          label="Public URL"
          value={p.siteUrl || ""}
          onChange={(v) => update({ siteUrl: v })}
          placeholder="https://your-site.vercel.app"
          hint="Leave blank to fall back to whichever address the browser is currently on."
        />

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={(p.siteUrl || "").trim() || "https://example.com"}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            open site
          </a>
          <button
            type="button"
            onClick={() => {
              const url = (p.siteUrl || "").trim() || window.location.origin;
              navigator.clipboard
                ?.writeText(url)
                .then(() => alert(`Copied: ${url}`))
                .catch(() => alert(url));
            }}
            className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            copy link
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon name="download" className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              CV / Resume
            </h4>
            <p className="text-sm text-slate-400">
              Backs every &ldquo;Download CV&rdquo; button on the site.
            </p>
          </div>
        </div>

        <UploadField
          label="Resume file (PDF, max 10 MB)"
          kind="pdf"
          accept="application/pdf,.pdf"
          maxMB={10}
          currentUrl={p.resumeUrl}
          storagePath={(f) => `cv/resume-${stamp(extFor(f))}`}
          onUploaded={(url) => store({ resumeUrl: url }, "CV uploaded and published.")}
          onCleared={() => update({ resumeUrl: "" })}
        />

        <TextInput
          label="…or paste a CV link"
          value={p.resumeUrl}
          onChange={(v) => update({ resumeUrl: v })}
          hint="Overrides the uploaded file if you set an external link."
        />

        {p.resumeUrl && /\.pdf($|\?)/i.test(p.resumeUrl) && (
          <iframe
            title="Current CV"
            src={p.resumeUrl}
            className="h-64 w-full rounded-lg border border-white/10 bg-obsidian"
          />
        )}
      </Card>

      <Card>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Icon name="image" className="h-5 w-5" />
          </span>
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Brand images
            </h4>
            <p className="text-sm text-slate-400">
              Compressed in your browser before upload.
            </p>
          </div>
        </div>

        <ImageUploadField
          label="Logo / avatar"
          currentUrl={p.logoUrl}
          storagePath={(f) => `profile/logo-${stamp(extFor(f))}`}
          onUploaded={(url) => store({ logoUrl: url }, "Logo uploaded and published.")}
          onCleared={() => update({ logoUrl: "" })}
          hint="Shown in the navbar. Square images work best."
        />

        <ImageUploadField
          label="Favicon"
          currentUrl={p.faviconUrl}
          storagePath={(f) => `profile/favicon-${stamp(extFor(f))}`}
          onUploaded={(url) => store({ faviconUrl: url }, "Favicon uploaded and published.")}
          onCleared={() => update({ faviconUrl: "" })}
          hint="Small square image shown in the browser tab."
        />
      </Card>
    </div>
  );
}
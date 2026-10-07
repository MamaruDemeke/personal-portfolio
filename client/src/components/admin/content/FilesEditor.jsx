import { Card, TextInput, UploadField, ImageUploadField } from "../fields.jsx";
import { useFile } from "../../../hooks/useFile.jsx";
import Icon from "../../Icon.jsx";

export default function FilesEditor({ content, update, persist }) {
  const p = content.profile;
  const resumeUri = useFile(p.resumeFile);

  const store = (patch, message) =>
    persist
      ? persist({ ...content, profile: { ...content.profile, ...patch } }, message)
      : update(patch);

  const resumePreview = resumeUri || p.resumeUrl || "";
  const resumeIsImage =
    p.resumeFile?.type?.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif)($|\?)/i.test(p.resumeUrl || "");

  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-accent/10 px-4 py-3 text-sm text-accent">
        Uploads are stored free in Firestore (no card required) and publish
        themselves — the moment a file lands, the link is live. Each file is
        capped at 700 KB, the Firestore document limit.
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
          label="Resume file (any format, max 700 KB)"
          kind="any"
          accept=".pdf,.doc,.docx,.rtf,.txt,.odt,.xls,.xlsx,.ppt,.pptx,image/*,application/pdf,.jpg,.jpeg,.png,.webp"
          fileId={`cv-${Date.now()}`}
          currentRef={p.resumeFile}
          hint="PDF, Word, text or image — anything up to 700 KB, stored free in Firestore."
          onUploaded={(ref) => store({ resumeFile: ref }, "CV uploaded and published.")}
          onCleared={() => update({ resumeFile: null })}
        />

        <TextInput
          label="…or paste a CV link"
          value={p.resumeUrl}
          onChange={(v) => update({ resumeUrl: v })}
          hint="Overrides the uploaded file if you set an external link."
        />

        {resumePreview && resumeIsImage ? (
          <img
            src={resumePreview}
            alt="Current CV"
            className="max-h-64 w-full rounded-lg border border-white/10 object-contain bg-obsidian"
          />
        ) : (
          resumePreview && (
            <iframe
              title="Current CV"
              src={resumePreview}
              className="h-64 w-full rounded-lg border border-white/10 bg-obsidian"
            />
          )
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
              Compressed in your browser, then stored free in Firestore.
            </p>
          </div>
        </div>

        <ImageUploadField
          label="Logo / avatar"
          currentUrl={p.logoUrl}
          maxBytes={300 * 1024}
          onUploaded={(url) => store({ logoUrl: url }, "Logo uploaded and published.")}
          onCleared={() => update({ logoUrl: "" })}
          hint="Shown in the navbar. Square images work best. Max 300 KB."
        />

        <ImageUploadField
          label="Favicon"
          currentUrl={p.faviconUrl}
          maxBytes={300 * 1024}
          onUploaded={(url) => store({ faviconUrl: url }, "Favicon uploaded and published.")}
          onCleared={() => update({ faviconUrl: "" })}
          hint="Small square image shown in the browser tab. Max 300 KB."
        />
      </Card>
    </div>
  );
}
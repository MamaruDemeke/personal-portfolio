import { Card, Grid, TextInput, UploadField, safeSlug, extFor } from "../fields.jsx";

const EMPTY = { title: "", issuer: "", year: "", url: "", fileUrl: "" };

export default function CertificatesEditor({ content, update, persist }) {
  const certs = content.certificates || [];

  /** Publishes straight to Firestore so the file link survives without the
      admin having to press "Save & Publish Changes" afterwards. */
  const storeFile = (i, url) => {
    if (!persist) return patch(i, "fileUrl", url);
    const next = certs.map((c, idx) => (idx === i ? { ...c, fileUrl: url } : c));
    persist(
      { ...content, certificates: next },
      url ? "Certificate uploaded and published." : "Certificate link cleared."
    );
  };

  const add = () => update([...certs, { ...EMPTY }]);
  const remove = (i) => update(certs.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= certs.length) return;
    const next = [...certs];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };
  const patch = (i, field, value) =>
    update(certs.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Upload the actual certificate file — the public card links to it.
        </p>
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
        >
          + Add certificate
        </button>
      </div>

      {certs.length === 0 && (
        <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">
          No certificates yet.
        </p>
      )}

      {certs.map((cert, i) => (
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
                aria-label="Remove certificate"
              >
                ✕
              </button>
            </div>
          </div>

          <Grid cols={4}>
            <TextInput
              label="Title"
              value={cert.title}
              onChange={(v) => patch(i, "title", v)}
            />
            <TextInput
              label="Issuer"
              value={cert.issuer}
              onChange={(v) => patch(i, "issuer", v)}
            />
            <TextInput
              label="Year"
              value={cert.year}
              onChange={(v) => patch(i, "year", v)}
            />
            <TextInput
              label="Credential link (optional)"
              value={cert.url}
              onChange={(v) => patch(i, "url", v)}
              placeholder="https://verify.link"
            />
          </Grid>

          <UploadField
            label="Certificate file"
            accept="application/pdf,image/*"
            maxMB={10}
            kind="any"
            compress
            hint="PDF or image, up to 10 MB. Images are compressed first."
            currentUrl={cert.fileUrl}
            storagePath={(f) =>
              `certificates/${safeSlug(cert.title) || "certificate"}-${Date.now()}.${extFor(f)}`
            }
            onUploaded={(url) => storeFile(i, url)}
            onCleared={() => storeFile(i, "")}
          />

          {cert.fileUrl && /\.pdf($|\?)/i.test(cert.fileUrl) && (
            <iframe
              title={cert.title}
              src={cert.fileUrl}
              className="h-48 w-full rounded-lg border border-white/10 bg-obsidian"
            />
          )}
          {cert.fileUrl && /\.(png|jpe?g|webp|gif)($|\?)/i.test(cert.fileUrl) && (
            <img
              src={cert.fileUrl}
              alt={cert.title}
              className="max-h-48 w-full rounded-lg border border-white/10 object-contain"
            />
          )}
        </Card>
      ))}
    </div>
  );
}
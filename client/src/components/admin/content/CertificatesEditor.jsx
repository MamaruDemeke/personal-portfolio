import { Card, Grid, TextInput, UploadField } from "../fields.jsx";
import { useFile } from "../../../hooks/useFile.jsx";

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `cert-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EMPTY = { title: "", issuer: "", year: "", url: "", file: null };

function CertFileArea({ cert, onStoreFile }) {
  const uri = useFile(cert.file);
  const src = uri || cert.fileUrl;
  const isImage =
    (cert.file?.type || "").startsWith("image/") ||
    /\.(png|jpe?g|webp|gif)($|\?)/i.test(cert.fileUrl || "");

  return (
    <>
      <UploadField
        label="Certificate file"
        accept=".pdf,.doc,.docx,.rtf,.txt,.png,.jpg,.jpeg,.webp,.gif,image/*,application/pdf"
        kind="any"
        compress
        fileId={`cert-${cert.id}-${Date.now()}`}
        currentRef={cert.file}
        hint="Any format up to 700 KB — PDF, Word or image. Images are compressed in your browser first."
        onUploaded={(ref) => onStoreFile(ref)}
        onCleared={() => onStoreFile(null)}
      />
      {src && (isImage ? (
        <img
          src={src}
          alt={cert.title}
          className="max-h-48 w-full rounded-lg border border-white/10 object-contain"
        />
      ) : (
        <iframe
          title={cert.title}
          src={src}
          className="h-48 w-full rounded-lg border border-white/10 bg-obsidian"
        />
      ))}
    </>
  );
}

export default function CertificatesEditor({ content, update, persist }) {
  const certs = content.certificates || [];

  /** Publishes straight to Firestore so the file link survives without the
      admin having to press "Save & Publish Changes" afterwards. */
  const storeFile = (i, ref) => {
    const next = certs.map((c, idx) =>
      idx === i ? { ...c, file: ref, fileUrl: "" } : c
    );
    if (!persist) return update(next);
    persist(
      { ...content, certificates: next },
      ref ? "Certificate uploaded and published." : "Certificate removed."
    );
  };

  const add = () => update([...certs, { ...EMPTY, id: newId() }]);
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
          Files are stored free in Firestore (max 700 KB each).
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
        <Card key={cert.id || i}>
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

          <CertFileArea cert={cert} onStoreFile={(ref) => storeFile(i, ref)} />
        </Card>
      ))}
    </div>
  );
}
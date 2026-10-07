import { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { compressImage } from "../../utils/compressImage.js";
import { useFile, fileAnchorProps } from "../../hooks/useFile.jsx";
import Icon from "../Icon.jsx";

export const safeSlug = (s = "") =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const stamp = (ext) => `${Date.now()}.${ext}`;

/* ---------- basic layout ---------- */

export function Card({ children, className = "" }) {
  return <div className={`glass-card space-y-4 p-6 ${className}`}>{children}</div>;
}

export function Grid({ cols = 2, children }) {
  const map = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };
  return <div className={`grid gap-4 ${map[cols]}`}>{children}</div>;
}

export function Field({ label, hint, children }) {
  return (
    <div>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

/* ---------- inputs ---------- */

export function TextInput({
  label,
  value = "",
  onChange,
  placeholder,
  type = "text",
  hint,
  ...rest
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        {...rest}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value = "",
  onChange,
  rows = 4,
  placeholder,
  hint,
  ...rest
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input-field resize-y"
        {...rest}
      />
    </Field>
  );
}

export function SelectInput({ label, value = "", onChange, options = [], hint }) {
  const valOf = (o) => (typeof o === "string" ? o : o.value);
  const list = options.some((o) => valOf(o) === value)
    ? options
    : [{ value, label: value || "Select" }, ...options];

  return (
    <Field label={label} hint={hint}>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      >
        {list.map((o) => {
          const val = valOf(o);
          const lab = typeof o === "string" ? o : o.label;
          return (
            <option key={val} value={val} className="bg-obsidian">
              {lab}
            </option>
          );
        })}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-obsidian/40 px-4 py-3">
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-emerald-500"
      />
      <span>
        <span className="block text-sm text-slate-200">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

/* ---------- list helpers ---------- */

export function toList(value) {
  if (Array.isArray(value)) return value;
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ---------- file upload ---------- */

/* Some browsers report an empty type; derive one from the filename. */
const TYPE_BY_EXT = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  rtf: "application/rtf",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

function resolveType(file) {
  if (file.type) return file.type;
  const ext = String(file.name || "")
    .split(".")
    .pop()
    ?.toLowerCase();
  return TYPE_BY_EXT[ext] || "application/octet-stream";
}

/** File extension that matches the contentType actually sent to Storage.
    Prefers the real filename so a `.docx` stays a `.docx` instead of being
    renamed to `.jpg`. */
const EXT_OK = /^[a-z0-9]{1,6}$/;

export function extFor(file) {
  const name = String(file?.name || "");
  const raw = name.includes(".") ? (name.split(".").pop() || "").toLowerCase() : "";
  if (EXT_OK.test(raw)) return raw;
  const t = resolveType(file);
  if (t === "application/pdf") return "pdf";
  if (t === "image/jpeg") return "jpg";
  if (t === "image/png") return "png";
  if (t === "image/webp") return "webp";
  if (t === "image/gif") return "gif";
  if (t === "image/svg+xml") return "svg";
  return "bin";
}

/** Turns Firebase errors into something actionable. */
export function explainUploadError(err) {
  const code = err?.code || "";
  const msg = err?.message || "";
  if (code === "permission-denied") {
    return "Your admin session expired or lacks access — sign out and back in, then retry.";
  }
  if (code === "unauthenticated") {
    return "You must be signed in to upload. Sign out and back in, then retry.";
  }
  if (code === "cancelled") return "Upload was canceled.";
  if (code === "unavailable") {
    return "Firestore is unreachable right now. Try again in a moment.";
  }
  if (/invalid-argument|too large/i.test(msg)) return FILE_TOO_BIG_MSG;
  return msg || "Upload failed.";
}

/** Choices here are dictated by the free "no card" upload path: every file
    lives in its own Firestore document, and Firestore caps a document at
    1 MiB. Base64 adds ~33%, so a 700 KB file becomes roughly 933 KB of text.
    Files over that are rejected on the client before any network call. */
export const MAX_FILE_BYTES = 700 * 1024;
export const MAX_B64_LEN = 960000;
export const FILE_TOO_BIG_MSG =
  `That file is over ${MAX_FILE_BYTES / 1024} KB — the limit for free ` +
  "uploads. Shrink it (a PDF usually only needs its images compressed) and " +
  "try again.";

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",").pop() || "");
    reader.onerror = () =>
      reject(reader.error || new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function useUploadTask() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  /** Reads the file as base64 and saves it to files/{fileId}. Resolves to the
      reference object to keep in the site/main document. */
  const start = async (file, fileId) => {
    if (!db) throw new Error("Firebase is not configured on this deployment.");
    if (file.size > MAX_FILE_BYTES) throw new Error(FILE_TOO_BIG_MSG);

    setUploading(true);
    setProgress(10);
    setError("");

    const data = await toBase64(file);
    if (data.length > MAX_B64_LEN) throw new Error(FILE_TOO_BIG_MSG);
    setProgress(60);

    const type = resolveType(file);
    await setDoc(doc(db, "files", fileId), {
      name: file.name || `${fileId}.${extFor(file)}`,
      type,
      size: file.size,
      data,
      updatedAt: new Date().toISOString(),
    });

    setProgress(100);
    setUploading(false);
    return { fileId, name: file.name || fileId, type, size: file.size };
  };

  /** Inline variant for small brand images: returns a data URI directly and
      stores nothing extra — the URI itself is written into the content doc. */
  const inline = async (file, maxBytes) => {
    if (!db) throw new Error("Firebase is not configured on this deployment.");
    setUploading(true);
    setProgress(10);
    setError("");

    const compressed = await compressImage(file);
    if (compressed.size > maxBytes) {
      throw new Error(
        `That image is still larger than ${Math.round(maxBytes / 1024)} KB after compression.`
      );
    }
    setProgress(80);

    const data = await toBase64(compressed);
    setProgress(100);
    setUploading(false);
    return `data:${resolveType(compressed)};base64,${data}`;
  };

  return { uploading, progress, error, setError, setUploading, start, inline };
}

export function UploadField({
  label,
  accept,
  currentRef,
  onUploaded,
  onCleared,
  hint,
  kind = "file",
  fileId,
  compress = false,
}) {
  const { uploading, progress, error, setError, setUploading, start } =
    useUploadTask();
  const preview = useFile(currentRef);

  /* Holds the bar at 100% for a moment so a finished upload is visible instead
     of the row snapping back to the idle state. */
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => setDone(false), 1200);
    return () => clearTimeout(t);
  }, [done]);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setDone(false);

    if (kind === "image" && file.type && !file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (kind === "pdf" && file.type && file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(FILE_TOO_BIG_MSG);
      return;
    }

    try {
      let payload = file;
      if (compress && file.type && file.type.startsWith("image/")) {
        const compressed = await compressImage(file);
        if (compressed.size <= MAX_FILE_BYTES) payload = compressed;
      }
      const ref = await start(payload, fileId);
      setDone(true);
      onUploaded(ref);
      setError("");
    } catch (err) {
      setUploading(false);
      setError(explainUploadError(err));
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-accent/50 hover:text-accent">
          <Icon name="upload" className="h-4 w-4" />
          {uploading
            ? "Uploading..."
            : currentRef
              ? "Replace file"
              : "Upload file"}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {uploading && (
          <span className="font-mono text-xs text-accent">
            {done ? "done" : `${Math.round(progress)}%`}
          </span>
        )}
        {currentRef && (
          <button
            type="button"
            onClick={onCleared}
            className="font-mono text-xs text-red-400 hover:text-red-300"
          >
            remove
          </button>
        )}
      </div>
      {uploading && !done && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
      {preview && (
        <a
          href={preview}
          {...fileAnchorProps(preview, currentRef?.name)}
          className="mt-2 inline-block font-mono text-xs text-accent hover:underline"
        >
          view current file
        </a>
      )}
    </Field>
  );
}

export function ImageUploadField({
  label,
  currentUrl,
  onUploaded,
  onCleared,
  hint,
  maxBytes = MAX_FILE_BYTES,
  aspect = "aspect-square",
}) {
  const { uploading, progress, error, setError, setUploading, inline } =
    useUploadTask();

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    if (file.type && !file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > maxBytes) {
      setError(`That image is larger than ${Math.round(maxBytes / 1024)} KB.`);
      return;
    }
    try {
      // Shrink in the browser first so the upload is quick on slow connections.
      const url = await inline(file, maxBytes);
      onUploaded(url);
      setError("");
    } catch (err) {
      setUploading(false);
      setError(explainUploadError(err));
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex items-center gap-4">
        <div
          className={`relative ${aspect} w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-obsidian/60`}
        >
          {currentUrl ? (
            <img src={currentUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <Icon name="image" className="h-6 w-6" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-obsidian/70">
              <span className="font-mono text-[10px] text-accent">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-accent/50 hover:text-accent">
            <Icon name="upload" className="h-4 w-4" />
            {uploading
              ? "Uploading..."
              : currentUrl
                ? "Replace image"
                : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
          {uploading && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          {currentUrl && (
            <button
              type="button"
              onClick={onCleared}
              className="mt-2 block font-mono text-xs text-red-400 hover:text-red-300"
            >
              remove image
            </button>
          )}
          {!currentUrl && !uploading && !error && (
            <span className="mt-2 block font-mono text-xs text-slate-500">
              no file uploaded yet
            </span>
          )}
          {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
        </div>
      </div>
    </Field>
  );
}

/* ---------- write helpers ---------- */

export async function saveSiteContent(content) {
  if (!db) throw new Error("Firebase is not configured.");
  await setDoc(doc(db, "site", "main"), content, { merge: true });
}
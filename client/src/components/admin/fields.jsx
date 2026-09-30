import { useState } from "react";
import { db, storage } from "../../firebase.js";
import { doc, setDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { compressImage } from "../../utils/compressImage.js";
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
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
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

function useUploadTask() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  /** Resumable upload with a live percentage; returns the download URL. */
  const start = (file, path) =>
    new Promise((resolve, reject) => {
      setUploading(true);
      setProgress(0);
      const task = uploadBytesResumable(storageRef(storage, path), file, {
        contentType: file.type || "application/octet-stream",
      });
      task.on(
        "state_changed",
        (snap) => setProgress((snap.bytesTransferred / snap.totalBytes) * 100),
        (err) => {
          setError(err.message);
          setUploading(false);
          reject(err);
        },
        () => {
          getDownloadURL(task.snapshot.ref).then(resolve, reject).finally(() => {
            setUploading(false);
          });
        }
      );
    });

  return { uploading, progress, error, setError, setUploading, start };
}

export function UploadField({
  label,
  accept,
  currentUrl,
  onUploaded,
  onCleared,
  hint,
  kind = "file",
  storagePath,
  maxMB = 10,
  compress = false,
}) {
  const { uploading, progress, error, setError, setUploading, start } =
    useUploadTask();

  const handleFile = async (file) => {
    if (!file) return;
    setError("");

    if (kind === "image" && !file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (kind === "pdf" && file.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`That file is larger than ${maxMB} MB.`);
      return;
    }

    try {
      let payload = file;
      if (compress && file.type.startsWith("image/")) {
        payload = await compressImage(file);
      }
      const url = await start(payload, storagePath(file));
      onUploaded(url);
    } catch (err) {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:border-accent/50 hover:text-accent">
          <Icon name="upload" className="h-4 w-4" />
          {uploading
            ? "Uploading..."
            : currentUrl
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
            {Math.round(progress)}%
          </span>
        )}
        {currentUrl && (
          <button
            type="button"
            onClick={onCleared}
            className="font-mono text-xs text-red-400 hover:text-red-300"
          >
            remove
          </button>
        )}
      </div>
      {uploading && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
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
  storagePath,
  maxMB = 5,
  aspect = "aspect-square",
}) {
  const { uploading, progress, error, setError, setUploading, start } =
    useUploadTask();

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`That image is larger than ${maxMB} MB.`);
      return;
    }
    try {
      // Shrink in the browser first so the upload is quick on slow connections.
      const compressed = await compressImage(file);
      if (compressed.size > maxMB * 1024 * 1024) {
        setError("Still too large after compression - try a smaller image.");
        return;
      }
      const url = await start(compressed, storagePath(file));
      onUploaded(url);
    } catch {
      setUploading(false);
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
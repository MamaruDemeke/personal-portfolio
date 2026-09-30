import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase.js";
import { DEFAULT_CONTENT } from "../../hooks/useSiteContent.jsx";
import Icon from "../Icon.jsx";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function FileUpload({ label, accept, onFile, uploading, hasFile, fileUrl }) {
  const inputId = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <Field label={label}>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-accent/50 hover:text-accent ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Icon name="download" className="h-4 w-4 rotate-180" />
          {uploading ? "Uploading…" : hasFile ? "Replace file" : "Upload file"}
          <input
            id={inputId}
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
        </label>
        {uploading && (
          <span className="font-mono text-xs text-accent">sending to cloud…</span>
        )}
        {hasFile && fileUrl && !uploading && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-accent hover:text-mint"
          >
            view current file ↗
          </a>
        )}
      </div>
    </Field>
  );
}

function Text({ label, value, onChange, placeholder }) {
  return (
    <Field label={label}>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
      />
    </Field>
  );
}

export default function ContentForm() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [cvUploading, setCvUploading] = useState(false);
  const [certUploading, setCertUploading] = useState(null); // index

  useEffect(() => {
    let alive = true;
    getDoc(doc(db, "site", "main"))
      .then((snap) => {
        if (!alive) return;
        if (snap.exists()) {
          const d = snap.data();
          setContent({
            profile: { ...DEFAULT_CONTENT.profile, ...(d.profile || {}) },
            skills: d.skills?.length ? d.skills : DEFAULT_CONTENT.skills,
            experience: d.experience?.length
              ? d.experience
              : DEFAULT_CONTENT.experience,
            certificates: d.certificates?.length
              ? d.certificates
              : DEFAULT_CONTENT.certificates,
          });
        }
      })
      .catch((err) => setNotice(`Load error: ${err.message}`))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const setProfile = (key) => (v) =>
    setContent((c) => ({ ...c, profile: { ...c.profile, [key]: v } }));

  const setList = (key, i, field, value) =>
    setContent((c) => {
      const list = c[key].map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      );
      return { ...c, [key]: list };
    });

  const addListItem = (key, empty) =>
    setContent((c) => ({ ...c, [key]: [...c[key], empty] }));

  const removeListItem = (key, i) =>
    setContent((c) => ({
      ...c,
      [key]: c[key].filter((_, idx) => idx !== i),
    }));

  const csv = (s) =>
    s.split(",").map((x) => x.trim()).filter(Boolean);

  const uploadFile = async (path, file) => {
    const r = ref(storage, path);
    await uploadBytes(r, file, { contentType: file.type });
    return getDownloadURL(r);
  };

  const onCvFile = async (file) => {
    if (file.type !== "application/pdf") {
      setNotice("CV must be a PDF file.");
      return;
    }
    setCvUploading(true);
    setNotice("");
    try {
      const url = await uploadFile("cv/resume.pdf", file);
      setProfile("resumeUrl")(url);
      setNotice("CV uploaded — click Save & Publish Changes to make it live.");
    } catch (err) {
      setNotice(`CV upload error: ${err.message}`);
    } finally {
      setCvUploading(false);
    }
  };

  const onCertFile = async (i, file) => {
    setCertUploading(i);
    setNotice("");
    try {
      const safe = (content.certificates[i].title || "certificate")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const ext = file.name.split(".").pop() || "pdf";
      const url = await uploadFile(
        `certificates/${safe || "certificate"}-${Date.now()}.${ext}`,
        file
      );
      setList("certificates", i, "fileUrl", url);
      setNotice(
        "Certificate file uploaded — click Save & Publish Changes to make it live."
      );
    } catch (err) {
      setNotice(`Certificate upload error: ${err.message}`);
    } finally {
      setCertUploading(null);
    }
  };

  const onSave = async () => {
    setSaving(true);
    setNotice("");
    try {
      await setDoc(doc(db, "site", "main"), content);
      setNotice("Saved — the public site updates instantly.");
    } catch (err) {
      setNotice(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="font-mono text-sm text-slate-500">loading content…</p>;
  }

  const { profile, skills, experience, certificates } = content;

  return (
    <div className="space-y-8">
      {notice && (
        <p
          className={`rounded-lg px-4 py-2.5 text-sm ${
            notice.startsWith("Saved")
              ? "bg-accent/10 text-accent"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {notice}
        </p>
      )}

      {/* ---- Profile ---- */}
      <section className="glass-card space-y-4 p-6">
        <h2 className="font-display text-lg font-bold text-white">Profile</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Text label="Brand mark" value={profile.brand || ""} onChange={setProfile("brand")} />
          <Text label="Full name" value={profile.name} onChange={setProfile("name")} />
          <Text label="First name" value={profile.firstName || ""} onChange={setProfile("firstName")} />
          <Text label="Role" value={profile.role} onChange={setProfile("role")} />
          <Text label="Location" value={profile.location} onChange={setProfile("location")} />
          <Text label="Status pill" value={profile.status || ""} onChange={setProfile("status")} />
          <Text label="Email" value={profile.email} onChange={setProfile("email")} />
          <Text label="Phone" value={profile.phone} onChange={setProfile("phone")} />
          <Text label="Alt phone" value={profile.phoneAlt || ""} onChange={setProfile("phoneAlt")} />
          <Text label="CV file URL" value={profile.resumeUrl || "/resume.pdf"} onChange={setProfile("resumeUrl")} />
        </div>
        <Field label="Tagline">
          <textarea
            rows={3}
            value={profile.tagline}
            onChange={(e) => setProfile("tagline")(e.target.value)}
            className="input-field resize-y"
          />
        </Field>
        <FileUpload
          label="CV / Resume (PDF — replaces the public Download CV button)"
          accept="application/pdf"
          onFile={onCvFile}
          uploading={cvUploading}
          hasFile={Boolean(profile.resumeUrl)}
          fileUrl={profile.resumeUrl}
        />
      </section>

      {/* ---- Skills ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Skills</h2>
          <button
            onClick={() => addListItem("skills", { title: "New Category", skills: [] })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            <Icon name="plus" className="h-4 w-4" /> Category
          </button>
        </div>
        {skills.map((cat, i) => (
          <div key={i} className="glass-card space-y-4 p-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Text
                  label="Category title"
                  value={cat.title}
                  onChange={(v) => setList("skills", i, "title", v)}
                />
              </div>
              <button
                onClick={() => removeListItem("skills", i)}
                className="rounded-lg border border-white/10 p-2.5 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                aria-label="Remove category"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
            <Field label="Skills (comma separated)">
              <input
                type="text"
                value={cat.skills.join(", ")}
                onChange={(e) =>
                  setList("skills", i, "skills", csv(e.target.value))
                }
                className="input-field"
                placeholder="HTML, CSS, JavaScript"
              />
            </Field>
          </div>
        ))}
      </section>

      {/* ---- Experience ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Experience</h2>
          <button
            onClick={() =>
              addListItem("experience", {
                company: "Company",
                role: "Role",
                period: "Period",
                summary: "",
                highlights: [],
                tech: [],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            <Icon name="plus" className="h-4 w-4" /> Job
          </button>
        </div>
        {experience.map((job, i) => (
          <div key={i} className="glass-card space-y-4 p-6">
            <div className="flex items-end justify-end">
              <button
                onClick={() => removeListItem("experience", i)}
                className="rounded-lg border border-white/10 p-2.5 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                aria-label="Remove job"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Text label="Company" value={job.company} onChange={(v) => setList("experience", i, "company", v)} />
              <Text label="Role" value={job.role} onChange={(v) => setList("experience", i, "role", v)} />
              <Text label="Period" value={job.period} onChange={(v) => setList("experience", i, "period", v)} />
              <Field label="Tech (comma separated)">
                <input
                  type="text"
                  value={(job.tech || []).join(", ")}
                  onChange={(e) =>
                    setList("experience", i, "tech", csv(e.target.value))
                  }
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="Summary">
              <textarea
                rows={2}
                value={job.summary}
                onChange={(e) => setList("experience", i, "summary", e.target.value)}
                className="input-field resize-y"
              />
            </Field>
            <Field label="Highlights (one per line)">
              <textarea
                rows={3}
                value={(job.highlights || []).join("\n")}
                onChange={(e) =>
                  setList(
                    "experience",
                    i,
                    "highlights",
                    e.target.value.split("\n").map((x) => x.trim()).filter(Boolean)
                  )
                }
                className="input-field resize-y"
              />
            </Field>
          </div>
        ))}
      </section>

      {/* ---- Certificates ---- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">Certificates</h2>
          <button
            onClick={() =>
              addListItem("certificates", { title: "", issuer: "", year: "", url: "" })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-accent/50 hover:text-accent"
          >
            <Icon name="plus" className="h-4 w-4" /> Certificate
          </button>
        </div>
        {certificates.map((cert, i) => (
          <div key={i} className="glass-card space-y-4 p-6">
            <div className="flex items-end justify-end">
              <button
                onClick={() => removeListItem("certificates", i)}
                className="rounded-lg border border-white/10 p-2.5 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                aria-label="Remove certificate"
              >
                <Icon name="trash" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Text label="Title" value={cert.title} onChange={(v) => setList("certificates", i, "title", v)} />
              <Text label="Issuer" value={cert.issuer} onChange={(v) => setList("certificates", i, "issuer", v)} />
              <Text label="Year" value={cert.year} onChange={(v) => setList("certificates", i, "year", v)} />
              <Text label="Credential URL (optional)" value={cert.url || ""} onChange={(v) => setList("certificates", i, "url", v)} />
            </div>
            <FileUpload
              label="Certificate file (PDF or image — shown as a download link on the public card)"
              accept="application/pdf,image/*"
              onFile={(f) => onCertFile(i, f)}
              uploading={certUploading === i}
              hasFile={Boolean(cert.fileUrl)}
              fileUrl={cert.fileUrl}
            />
          </div>
        ))}
      </section>

      {/* ---- Save ---- */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary w-full justify-center shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="download" className="h-4 w-4 rotate-180" />
          {saving ? "Saving…" : "Save & Publish Changes"}
        </button>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { DEFAULT_CONTENT, mergeSiteContent } from "../../hooks/useSiteContent.jsx";
import { saveSiteContent } from "./fields.jsx";
import ProfileEditor from "./content/ProfileEditor.jsx";
import FilesEditor from "./content/FilesEditor.jsx";
import HeroEditor from "./content/HeroEditor.jsx";
import AboutEditor from "./content/AboutEditor.jsx";
import SkillsEditor from "./content/SkillsEditor.jsx";
import ExperienceEditor from "./content/ExperienceEditor.jsx";
import CertificatesEditor from "./content/CertificatesEditor.jsx";
import SocialsEditor from "./content/SocialsEditor.jsx";
import NavigationEditor from "./content/NavigationEditor.jsx";
import ProjectsSettingsEditor from "./content/ProjectsSettingsEditor.jsx";
import ContactEditor from "./content/ContactEditor.jsx";

const DRAFT_KEY = "portfolio-content-draft";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "files", label: "Files" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "certificates", label: "Certificates" },
  { id: "socials", label: "Socials" },
  { id: "layout", label: "Layout" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function ContentForm() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [published, setPublished] = useState(DEFAULT_CONTENT);
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const draftTimer = useRef(null);

  useEffect(() => {
    let alive = true;
    getDoc(doc(db, "site", "main"))
      .then((snap) => {
        if (!alive) return;
        const cloud = snap.exists()
          ? mergeSiteContent(snap.data())
          : DEFAULT_CONTENT;
        setPublished(cloud);
        let draft = null;
        try {
          const raw = localStorage.getItem(DRAFT_KEY);
          if (raw) draft = JSON.parse(raw);
        } catch {
          localStorage.removeItem(DRAFT_KEY);
        }
        if (draft) {
          setContent(mergeSiteContent({ ...cloud, ...draft }));
          setNotice("Unsaved draft restored — publish it or discard it below.");
        } else {
          setContent(cloud);
        }
      })
      .catch((err) => setNotice(`Load error: ${err.message}`))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (loading) return undefined;
    clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
      } catch {
        /* storage full — drafts are best-effort */
      }
    }, 500);
    return () => clearTimeout(draftTimer.current);
  }, [content, loading]);

  const dirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(published),
    [content, published]
  );

  const onSave = async () => {
    setSaving(true);
    setNotice("");
    try {
      await saveSiteContent(content);
      localStorage.removeItem(DRAFT_KEY);
      setPublished(content);
      setNotice("Saved — the public site updates instantly.");
    } catch (err) {
      setNotice(`Save error: ${err.message} — your edits are kept as a local draft.`);
    } finally {
      setSaving(false);
    }
  };

  /* Uploads are saved to their own Firestore docs, so the reference is
     persisted to Firestore the moment the file lands. Without this the file
     would sit in the files collection while the site kept serving the old
     link until someone hit "Save & Publish". */
  const persist = useCallback(async (next, message) => {
    setContent(next);
    try {
      await saveSiteContent(next);
      setPublished(next);
      localStorage.removeItem(DRAFT_KEY);
      setNotice(message || "File uploaded and published.");
    } catch (err) {
      setNotice(`File stored, but saving the link failed: ${err.message}`);
    }
  }, []);

  const onDiscard = () => {
    if (!window.confirm("Discard all unsaved changes and reload the published content?")) return;
    localStorage.removeItem(DRAFT_KEY);
    setContent(published);
    setNotice("Reverted to the last published version.");
  };

  if (loading) {
    return <p className="font-mono text-sm text-slate-500">loading content…</p>;
  }

  return (
    <div className="space-y-6">
      <nav className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3.5 py-1.5 text-sm transition-all ${
              tab === t.id
                ? "bg-accent font-semibold text-obsidian"
                : "border border-white/10 text-slate-300 hover:border-accent/50 hover:text-accent"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {notice && (
        <p
          className={`rounded-lg px-4 py-2.5 text-sm ${
            notice.startsWith("Saved")
              ? "bg-accent/10 text-accent"
              : "bg-amber-500/10 text-amber-300"
          }`}
        >
          {notice}
        </p>
      )}

      {tab === "profile" && (
        <ProfileEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, profile: { ...c.profile, ...patch } }))}
        />
      )}
      {tab === "files" && (
        <FilesEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, profile: { ...c.profile, ...patch } }))}
          persist={persist}
        />
      )}
      {tab === "hero" && (
        <HeroEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, hero: { ...c.hero, ...patch } }))}
        />
      )}
      {tab === "about" && (
        <AboutEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, about: { ...c.about, ...patch } }))}
        />
      )}
      {tab === "skills" && (
        <SkillsEditor
          content={content}
          update={(skills) => setContent((c) => ({ ...c, skills }))}
        />
      )}
      {tab === "experience" && (
        <ExperienceEditor
          content={content}
          update={(experience) => setContent((c) => ({ ...c, experience }))}
        />
      )}
      {tab === "certificates" && (
        <CertificatesEditor
          content={content}
          update={(certificates) => setContent((c) => ({ ...c, certificates }))}
          persist={persist}
        />
      )}
      {tab === "socials" && (
        <SocialsEditor
          content={content}
          update={(socials) => setContent((c) => ({ ...c, socials }))}
        />
      )}
      {tab === "layout" && (
        <NavigationEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, ...patch }))}
        />
      )}
      {tab === "projects" && (
        <ProjectsSettingsEditor
          content={content}
          update={(projectCategories) => setContent((c) => ({ ...c, projectCategories }))}
        />
      )}
      {tab === "contact" && (
        <ContactEditor
          content={content}
          update={(patch) => setContent((c) => ({ ...c, contact: { ...c.contact, ...patch } }))}
        />
      )}

      <div className="sticky bottom-4 z-10 flex flex-wrap gap-3">
        <button
          onClick={onSave}
          disabled={saving || !dirty}
          className="btn-primary flex-1 justify-center shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : dirty ? "Save & Publish Changes" : "All changes saved"}
        </button>
        <button
          onClick={onDiscard}
          disabled={!dirty}
          className="btn-outline disabled:cursor-not-allowed disabled:opacity-40"
        >
          Discard
        </button>
      </div>
    </div>
  );
}
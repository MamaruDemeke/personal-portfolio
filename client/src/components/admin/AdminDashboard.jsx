import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import { DEFAULT_CONTENT } from "../../hooks/useSiteContent.jsx";
import { sortProjects } from "../../hooks/useProjects.js";
import ProjectForm from "./ProjectForm.jsx";
import ContentForm from "./ContentForm.jsx";
import Icon from "../Icon.jsx";

const TABS = ["Content", "Projects", "Messages"];

const timeFmt = (ts) => {
  const d = ts?.toDate?.();
  return d ? d.toLocaleString() : "";
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("Content");
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CONTENT.projectCategories);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const u1 = onSnapshot(
      query(collection(db, "projects"), orderBy("createdAt", "desc")),
      (snap) =>
        setProjects(sortProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })))),
      (err) => setNotice(`Projects error: ${err.message}`)
    );
    const u2 = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "desc")),
      (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setNotice(`Messages error: ${err.message}`)
    );
    const u3 = onSnapshot(
      doc(db, "site", "main"),
      (snap) => {
        if (!snap.exists()) return;
        const cats = snap.data().projectCategories;
        if (Array.isArray(cats) && cats.length) setCategories(cats);
      },
      () => {}
    );
    return () => {
      u1();
      u2();
      u3();
    };
  }, []);

  /* Project categories exclude the "All" pseudo-filter. */
  const projectCategories = useMemo(
    () => categories.filter((c) => c !== "All"),
    [categories]
  );

  const removeProject = async (p) => {
    if (!window.confirm(`Delete project "${p.title}"?`)) return;
    try {
      await deleteDoc(doc(db, "projects", p.id));
    } catch (err) {
      setNotice(`Delete failed: ${err.message}`);
    }
  };

  /** Reorders by writing an `order` key the public list sorts by. */
  const moveProject = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    const batch = writeBatch(db);
    next.forEach((p, i) => batch.update(doc(db, "projects", p.id), { order: i }));
    try {
      await batch.commit();
    } catch (err) {
      setNotice(`Reorder failed: ${err.message}`);
    }
  };

  const toggleFeatured = async (p) => {
    try {
      await updateDoc(doc(db, "projects", p.id), { featured: !p.featured });
    } catch (err) {
      setNotice(`Update failed: ${err.message}`);
    }
  };

  const removeMessage = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteDoc(doc(db, "messages", m.id));
    } catch (err) {
      setNotice(`Delete failed: ${err.message}`);
    }
  };

  const toggleRead = async (m) => {
    try {
      await updateDoc(doc(db, "messages", m.id), { read: !m.read });
    } catch (err) {
      setNotice(`Update failed: ${err.message}`);
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm transition-all ${
                tab === t
                  ? "bg-accent font-semibold text-obsidian"
                  : "border border-white/10 text-slate-300 hover:border-accent/50 hover:text-accent"
              }`}
            >
              {t}
              {t === "Messages" && unread > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-1.5 text-xs text-white">
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <p className="mb-6 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {notice}
        </p>
      )}

      {tab === "Content" && <ContentForm />}

      {tab === "Projects" && (
        <section>
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setEditing({})}
              className="btn-primary !px-5 !py-2.5 text-sm"
            >
              + New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <p className="glass-card p-8 text-center text-slate-400">
              No projects yet — the public site is showing seed data. Create your
              first project to go live.
            </p>
          ) : (
            <div className="space-y-3">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className="glass-card flex flex-wrap items-center gap-4 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveProject(i, -1)}
                      disabled={i === 0}
                      className="rounded border border-white/10 p-1 text-slate-400 hover:text-accent disabled:opacity-30"
                      aria-label={`Move ${p.title} up`}
                    >
                      <Icon name="up" className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveProject(i, 1)}
                      disabled={i === projects.length - 1}
                      className="rounded border border-white/10 p-1 text-slate-400 hover:text-accent disabled:opacity-30"
                      aria-label={`Move ${p.title} down`}
                    >
                      <Icon name="down" className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {p.imageUrl && (
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-14 w-24 shrink-0 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">
                      {p.title}{" "}
                      {p.featured && (
                        <button
                          onClick={() => toggleFeatured(p)}
                          className="ml-1 rounded bg-accent/15 px-1.5 py-0.5 font-mono text-xs text-accent hover:bg-accent/25"
                          title="Toggle featured"
                        >
                          featured
                        </button>
                      )}
                    </h3>
                    <p className="truncate text-sm text-slate-400">
                      <span className="font-mono text-sage">{p.category}</span> —{" "}
                      {p.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-accent/50 hover:text-accent"
                      aria-label={`Edit ${p.title}`}
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeProject(p)}
                      className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                      aria-label={`Delete ${p.title}`}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "Messages" && (
        <section className="space-y-3">
          {messages.length === 0 ? (
            <p className="glass-card p-8 text-center text-slate-400">
              No messages yet.
            </p>
          ) : (
            messages.map((m) => (
              <article
                key={m.id}
                className={`glass-card p-5 ${m.read ? "" : "border-accent/40"}`}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">
                      {m.name}{" "}
                      {!m.read && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
                          new
                        </span>
                      )}
                    </h3>
                    <a
                      href={`mailto:${m.email}`}
                      className="font-mono text-sm text-accent hover:underline"
                    >
                      {m.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {timeFmt(m.createdAt)}
                    </span>
                    <button
                      onClick={() => toggleRead(m)}
                      className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-300 hover:border-accent/50 hover:text-accent"
                    >
                      Mark {m.read ? "unread" : "read"}
                    </button>
                    <button
                      onClick={() => removeMessage(m)}
                      className="rounded-lg border border-white/10 p-2 text-slate-300 hover:border-red-500/50 hover:text-red-400"
                      aria-label="Delete message"
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-line text-sm text-slate-300">
                  {m.message}
                </p>
              </article>
            ))
          )}
        </section>
      )}

      {/* Project create/edit modal */}
      {editing && (
        <ProjectForm
          initial={editing.id ? editing : null}
          categories={projectCategories}
          onClose={() => setEditing(null)}
          onSave={async (data) => {
            if (data.id) {
              const { id, ...rest } = data;
              await updateDoc(doc(db, "projects", id), rest);
            } else {
              await addDoc(collection(db, "projects"), {
                ...data,
                order: projects.length,
                createdAt: serverTimestamp(),
              });
            }
            setEditing(null);
          }}
        />
      )}
    </main>
  );
}
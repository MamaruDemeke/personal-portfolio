import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import useProjects from "../hooks/useProjects.js";
import { PROJECT_CATEGORIES } from "../data/constants.js";
import ProjectModal from "./ProjectModal.jsx";
import Icon from "./Icon.jsx";

function Placeholder({ title }) {
  return (
    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-surface to-obsidian">
      <span className="font-mono text-3xl font-bold text-accent/30">
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () =>
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active),
    [projects, active]
  );

  return (
    <Section id="projects" eyebrow="projects" title="Featured Projects">
      {/* Category filter */}
      <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-2">
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              active === cat
                ? "bg-accent font-semibold text-obsidian shadow-glow-accent"
                : "border border-white/10 text-slate-300 hover:border-accent/50 hover:text-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <p className="font-mono text-sm text-slate-500">loading projects…</p>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.button
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelected(p)}
                className="glass-card glass-card-hover group overflow-hidden text-left"
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Placeholder title={p.title} />
                )}
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-sage">{p.category}</span>
                    <div className="flex gap-3">
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} repository`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-accent"
                        >
                          <Icon name="github" className="h-4 w-4" />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} live site`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-accent"
                        >
                          <Icon name="external" className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.tech || []).slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-obsidian/70 px-2 py-0.5 font-mono text-xs text-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

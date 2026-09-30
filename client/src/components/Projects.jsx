import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import useProjects from "../hooks/useProjects.js";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import ProjectModal from "./ProjectModal.jsx";
import Icon from "./Icon.jsx";

function Placeholder({ title }) {
  return (
    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-surface-2 to-obsidian">
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 opacity-60"
      />
      <span className="font-display text-4xl font-extrabold text-accent/25">
        {title.slice(0, 2).toUpperCase()}
      </span>
    </div>
  );
}

export default function Projects() {
  const { projects, loading } = useProjects();
  const { projectCategories } = useSiteContent();
  const categories = projectCategories || [];
  const [active, setActive] = useState(categories[0] || "All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(
    () =>
      !categories.includes(active)
        ? projects
        : active === "All"
          ? projects
          : projects.filter((p) => p.category === active),
    [projects, active, categories]
  );

  return (
    <Section id="projects" eyebrow="projects" title="Selected" accent="work">
      {/* Category filter */}
      {categories.length > 0 && (
        <motion.div variants={fadeUp} className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-full px-5 py-2 text-sm transition-all duration-300 ${
                active === cat
                  ? "bg-accent font-semibold text-obsidian shadow-glow-accent"
                  : "border border-white/10 text-slate-300 hover:border-accent/50 hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      )}

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
                <div className="relative overflow-hidden">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Placeholder title={p.title} />
                  )}
                  {p.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-obsidian/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-mint backdrop-blur">
                      Featured
                    </span>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-sage">
                      {p.category}
                    </span>
                    <div className="flex gap-3">
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${p.title} repository`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 transition-colors hover:text-accent"
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
                          className="text-slate-400 transition-colors hover:text-accent"
                        >
                          <Icon name="external" className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-bold text-white transition-colors group-hover:text-mint">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.tech || []).slice(0, 4).map((t) => (
                      <span key={t} className="chip-accent">
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

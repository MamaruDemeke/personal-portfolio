import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import useProjects from "../hooks/useProjects.js";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import ProjectModal from "./ProjectModal.jsx";
import Icon from "./Icon.jsx";

const CARD_HUES = [
  ["#38BDF8", "#A78BFA"],
  ["#A78BFA", "#FB7185"],
  ["#10B981", "#22D3EE"],
  ["#FBBF24", "#FB7185"],
  ["#FB7185", "#A78BFA"],
  ["#A3E635", "#22D3EE"],
];

function Placeholder({ title, hue }) {
  return (
    <div
      className="relative flex h-48 items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${hue}22 0%, #16241D 60%, #070B09 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="grid-lines absolute inset-0 opacity-60"
      />
      <span
        className="font-display text-4xl font-extrabold"
        style={{ color: `${hue}66` }}
      >
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
          {categories.map((cat, i) => {
            const hue = ["#38BDF8", "#A78BFA", "#10B981", "#FBBF24", "#FB7185"][
              i % 5
            ];
            const isActive = active === cat;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="rounded-full px-5 py-2 text-sm transition-all duration-300"
                style={
                  isActive
                    ? {
                        background: `linear-gradient(120deg, ${hue}, ${hue}BB)`,
                        color: "#070B09",
                        fontWeight: 600,
                        boxShadow: `0 0 20px ${hue}55`,
                      }
                    : {
                        border: "1px solid rgba(255,255,255,0.10)",
                        color: "#cbd5e1",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = `${hue}80`;
                    e.currentTarget.style.color = hue;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                    e.currentTarget.style.color = "#cbd5e1";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>
      )}

      {loading ? (
        <p className="font-mono text-sm text-slate-500">loading projects…</p>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => {
              const [hueA, hueB] = CARD_HUES[idx % CARD_HUES.length];
              return (
                <motion.button
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelected({ ...p, hue: hueA })}
                  style={{ "--hue": hueA, "--hue-a": hueA, "--hue-b": hueB }}
                  className="hue-card group overflow-hidden text-left"
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
                      <Placeholder title={p.title} hue={hueA} />
                    )}
                    {p.featured && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur"
                        style={{ background: `${hueA}26`, color: hueA }}
                      >
                        Featured
                      </span>
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(to top, ${hueA}33, transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className="font-mono text-xs uppercase tracking-widest"
                        style={{ color: hueA }}
                      >
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
                            className="text-slate-400 transition-colors"
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
                            className="text-slate-400 transition-colors"
                          >
                            <Icon name="external" className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <h3
                      className="font-display text-lg font-bold text-white transition-colors"
                      style={{ color: "#fff" }}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {p.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(p.tech || []).slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2.5 py-1 font-mono text-xs"
                          style={{
                            borderColor: `${hueB}40`,
                            color: hueB,
                            background: `${hueB}12`,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

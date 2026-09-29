import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon.jsx";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = project ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-obsidian/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} details`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card relative max-h-[85vh] w-full max-w-2xl overflow-y-auto p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-accent"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>

            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="mb-6 h-56 w-full rounded-xl object-cover"
              />
            )}

            <span className="font-mono text-xs text-sage">{project.category}</span>
            <h3 className="mt-1 text-2xl font-bold text-white">{project.title}</h3>

            <p className="mt-4 whitespace-pre-line text-slate-300">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(project.tech || []).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-accent/30 bg-obsidian/60 px-2.5 py-1 font-mono text-xs text-accent"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary !px-5 !py-2.5 text-sm">
                  Live Demo <Icon name="external" className="h-4 w-4" />
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-outline !px-5 !py-2.5 text-sm">
                  Source Code <Icon name="github" className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { EXPERIENCE } from "../data/constants.js";
import Icon from "./Icon.jsx";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="experience" title="Where I've Worked">
      <div className="relative ml-3 space-y-12 border-l border-white/10 pl-8 md:ml-6">
        {EXPERIENCE.map((job) => (
          <motion.article
            key={`${job.company}-${job.period}`}
            variants={fadeUp}
            className="relative"
          >
            {/* Timeline dot */}
            <span className="absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-obsidian shadow-glow-accent" />

            <div className="glass-card glass-card-hover p-6">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {job.role}{" "}
                  <span className="text-accent">@ {job.company}</span>
                </h3>
                <span className="font-mono text-xs text-sage">{job.period}</span>
              </div>
              <p className="mb-3 text-sm text-slate-400">{job.summary}</p>
              <ul className="mb-4 space-y-1.5">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 font-mono text-accent">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                <Icon name="briefcase" className="h-4 w-4 text-sage" />
                {job.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-surface px-2 py-0.5 font-mono text-xs text-sage"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

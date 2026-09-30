import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

export default function Experience() {
  const { experience } = useSiteContent();

  return (
    <Section id="experience" eyebrow="experience" title="Where I've" accent="worked">
      <div className="relative ml-3 space-y-8 border-l border-white/10 pl-8 md:ml-6">
        {experience.map((job, i) => (
          <motion.article
            key={`${job.company}-${job.period}`}
            variants={fadeUp}
            className="group relative"
          >
            {/* Timeline node */}
            <span className="absolute -left-[41px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-accent bg-obsidian transition-all duration-300 group-hover:shadow-glow-accent" />

            <div className="glass-card glass-card-hover card-sheen p-7">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  <span className="mr-3 font-mono text-sm font-medium text-accent/60">
                    0{i + 1}.
                  </span>
                  {job.role}{" "}
                  <span className="serif-accent text-xl font-normal text-mint">
                    @ {job.company}
                  </span>
                </h3>
                <span className="chip">{job.period}</span>
              </div>
              <p className="mb-4 text-sm text-slate-400">{job.summary}</p>
              <ul className="mb-5 space-y-2">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 font-mono text-accent">▹</span>
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-2">
                {job.tech.map((t) => (
                  <span key={t} className="chip-accent inline-flex items-center gap-1.5">
                    <TechIcon name={t} />
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

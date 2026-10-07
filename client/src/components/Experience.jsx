import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

export default function Experience() {
  const { experience } = useSiteContent();

  const HUES = [
    ["#FBBF24", "#FB7185"],
    ["#A78BFA", "#FB7185"],
    ["#22D3EE", "#A78BFA"],
    ["#10B981", "#22D3EE"],
  ];

  return (
    <Section id="experience" eyebrow="experience" title="Where I've" accent="worked">
      <div className="relative ml-3 space-y-5 border-l border-white/10 pl-4 sm:pl-6 md:ml-6">
        {experience.map((job, i) => {
          const [a, b] = HUES[i % HUES.length];
          return (
            <motion.article
              key={`${job.company}-${job.period}`}
              variants={fadeUp}
              className="group relative"
              style={{ "--hue": a, "--hue-a": a, "--hue-b": b }}
            >
              {/* Timeline node */}
              <span
                className="absolute -left-[41px] top-6 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-obsidian transition-all duration-300"
                style={{ borderColor: a }}
              />

              <div className="hue-card p-3 sm:p-6">
                <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-xl font-bold text-white">
                    <span className="mr-3 font-mono text-sm font-medium" style={{ color: a }}>
                      0{i + 1}.
                    </span>
                    {job.role}{" "}
                    <span className="serif-accent grad-text text-xl font-normal">
                      @ {job.company}
                    </span>
                  </h3>
                  <span
                    className="rounded-full border px-3 py-1 font-mono text-xs"
                    style={{ borderColor: `${a}40`, color: a }}
                  >
                    {job.period}
                  </span>
                </div>
                <p className="mb-3 text-sm text-slate-400">{job.summary}</p>
                <ul className="mb-4 space-y-2">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-slate-300">
                      <span className="mt-0.5 font-mono" style={{ color: a }}>
                        ▹
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center gap-2">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs"
                      style={{ borderColor: `${b}45`, color: b, background: `${b}14` }}
                    >
                      <TechIcon name={t} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}

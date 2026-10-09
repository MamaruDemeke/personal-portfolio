import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

/* Accepts both legacy string skills ("React") and the new tiles
   ({ name, logo }) saved by the admin editor. */
const toItem = (s) =>
  typeof s === "string" ? { name: s, logo: s } : s;

const cardHues = [
  ["#A78BFA", "#FB7185"],
  ["#22D3EE", "#A78BFA"],
  ["#FBBF24", "#FB7185"],
  ["#10B981", "#22D3EE"],
  ["#FB7185", "#FBBF24"],
  ["#38BDF8", "#A3E635"],
];

export default function Skills() {
  const { skills } = useSiteContent();

  return (
    <Section id="skills" eyebrow="skills" title="My" accent="toolkit">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((cat, i) => {
          const [a, b] = cardHues[i % cardHues.length];
          const items = (cat.skills || []).map(toItem);
          return (
            <motion.div
              key={cat.id || cat.title}
              variants={fadeUp}
              style={{ "--hue": a, "--hue-a": a, "--hue-b": b }}
              className="hue-card flex flex-col p-4 sm:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-white sm:text-lg">
                  {cat.title}
                </h3>
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
                  style={{ color: a, borderColor: `${a}40` }}
                >
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {items.map((s) => (
                  <span
                    key={s.name}
                    className="flex min-h-[4rem] flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-obsidian/40 px-1 py-2 text-center transition-colors"
                    style={{ borderColor: `${a}2E` }}
                  >
                    <TechIcon name={s.logo || s.name} className="h-5 w-5" />
                    <span className="text-[10px] leading-tight text-slate-300">
                      {s.name}
                    </span>
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

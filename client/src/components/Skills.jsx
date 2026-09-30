import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

export default function Skills() {
  const { skills } = useSiteContent();

  return (
    <Section id="skills" eyebrow="skills" title="My" accent="toolkit">
      <div className="grid gap-5 md:grid-cols-3">
        {skills.map((cat, i) => (
          <motion.div
            key={cat.title}
            variants={fadeUp}
            className="glass-card glass-card-hover card-sheen flex flex-col p-7"
          >
            <span className="font-mono text-sm font-medium text-accent/60">
              0{i + 1}.
            </span>
            <h3 className="mb-5 mt-2 font-display text-xl font-bold text-white">
              {cat.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((skill) => (
                <span key={skill} className="chip inline-flex items-center gap-1.5">
                  <TechIcon name={skill} />
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

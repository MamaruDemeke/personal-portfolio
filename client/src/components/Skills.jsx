import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

export default function Skills() {
  const { skills } = useSiteContent();

  /* Each card cycles through the palette so a single-column phone view still
     shows colour variety, not just the three visible on desktop. */
  const cardHues = [
    ["#A78BFA", "#FB7185"],
    ["#22D3EE", "#A78BFA"],
    ["#FBBF24", "#FB7185"],
    ["#10B981", "#22D3EE"],
    ["#FB7185", "#FBBF24"],
    ["#38BDF8", "#A3E635"],
  ];

  return (
    <Section id="skills" eyebrow="skills" title="My" accent="toolkit">
      <div className="grid gap-5 md:grid-cols-3">
        {skills.map((cat, i) => {
          const [a, b] = cardHues[i % cardHues.length];
          return (
            <motion.div
              key={cat.title}
              variants={fadeUp}
              style={{ "--hue": a, "--hue-a": a, "--hue-b": b }}
              className="hue-card flex flex-col p-7"
            >
              <span
                className="font-mono text-sm font-medium"
                style={{ color: a }}
              >
                0{i + 1}.
              </span>
              <h3 className="mb-5 mt-2 font-display text-xl font-bold text-white">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="chip inline-flex items-center gap-1.5 transition-colors"
                    style={{ borderColor: `${a}40` }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = a;
                      e.currentTarget.style.borderColor = a;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "";
                      e.currentTarget.style.borderColor = `${a}40`;
                    }}
                  >
                    <TechIcon name={skill} />
                    {skill}
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

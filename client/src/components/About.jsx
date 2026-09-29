import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { PROFILE, SKILL_CATEGORIES } from "../data/constants.js";

export default function About() {
  return (
    <Section id="about" eyebrow="about" title="About Me">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <motion.div variants={fadeUp} className="space-y-4 text-slate-400">
          <p>
            I&apos;m <span className="font-semibold text-white">{PROFILE.name}</span>, a{" "}
            {PROFILE.role.toLowerCase()} based in {PROFILE.location} and a Computer
            Science graduate from Mekdela Amba University, where I earned a CGPA of
            3.91 and scored 78% on my national exit exam.
          </p>
          <p>
            I have a passion for utilizing technology to address real-world
            challenges. With strong skills in web development (HTML, CSS,
            JavaScript, React) and video editing, I&apos;m eager to contribute to a
            dynamic team, enhance operational efficiency and support company growth
            through innovative solutions and proactive problem-solving.
          </p>
          <p>
            I&apos;m a hardworking, responsible and quick-learning person — prepared
            to apply my technical and creative skills to any role, ensuring
            high-quality results and efficient task management.
          </p>
        </motion.div>

        {/* Categorized skill badges */}
        <motion.div variants={fadeUp} className="space-y-6">
          {SKILL_CATEGORIES.map((cat) => (
            <div key={cat.title} className="glass-card p-5">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                {cat.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-obsidian/60 px-3 py-1 text-xs text-slate-300 transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

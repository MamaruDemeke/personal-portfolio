import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

const STATS = [
  { value: "3.91", label: "CGPA" },
  { value: "78%", label: "Exit Exam" },
  { value: "2+", label: "Years Experience" },
];

export default function About() {
  const { profile } = useSiteContent();

  return (
    <Section id="about" eyebrow="about" title="Behind the" accent="pixels">
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {/* Bio — spans 2 rows on desktop */}
        <motion.div
          variants={fadeUp}
          className="glass-card card-sheen p-7 md:col-span-2 lg:row-span-2"
        >
          <h3 className="mb-4 font-display text-2xl font-bold text-white">
            Hi, I&apos;m {profile.name} —{" "}
            <span className="serif-accent text-mint">
              a builder of things
            </span>
          </h3>
          <div className="space-y-4 leading-relaxed text-slate-400">
            <p>
              A Computer Science graduate from Mekdela Amba University based in{" "}
              {profile.location}. I use technology to solve real-world
              challenges — through clean, responsive web development and
              compelling video storytelling.
            </p>
            <p>
              With strong skills in web development (HTML, CSS, JavaScript,
              React) and video editing, I&apos;m eager to contribute to a dynamic
              team, enhance operational efficiency and support growth through
              innovative solutions and proactive problem-solving.
            </p>
            <p>
              Hardworking, responsible and quick-learning — I bring technical
              precision and creative energy to every task, ensuring
              high-quality results.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-3 gap-3 md:col-span-3 lg:col-span-2 lg:grid-cols-1"
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass-card card-sheen flex flex-col items-center justify-center p-5 text-center lg:flex-row lg:justify-between lg:px-7 lg:text-left"
            >
              <span className="font-display text-3xl font-extrabold text-mint">
                {s.value}
              </span>
              <span className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500 lg:mt-0">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Availability */}
        <motion.div
          variants={fadeUp}
          className="glass-card card-sheen flex flex-col justify-between p-6 md:col-span-1"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <div className="mt-8">
            <p className="font-display text-lg font-bold text-white">
              Open to work
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Freelance &amp; full-time opportunities
            </p>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          variants={fadeUp}
          className="glass-card card-sheen flex flex-col justify-between p-6"
        >
          <Icon name="briefcase" className="h-6 w-6 text-accent" />
          <div className="mt-8">
            <p className="font-display text-lg font-bold text-white">
              {profile.location}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Working remotely, worldwide
            </p>
          </div>
        </motion.div>

        {/* Download CV card */}
        <motion.a
          variants={fadeUp}
          href={profile.resumeUrl || "/resume.pdf"}
          download
          className="glass-card glass-card-hover card-sheen group flex flex-col justify-between p-6"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform duration-300 group-hover:translate-y-0.5">
            <Icon name="download" className="h-5 w-5" />
          </span>
          <div className="mt-8">
            <p className="font-display text-lg font-bold text-white">
              Download CV
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400 transition-colors group-hover:text-accent">
              Resume — PDF
              <Icon name="arrow" className="h-4 w-4" />
            </p>
          </div>
        </motion.a>
      </div>
    </Section>
  );
}

import { motion } from "framer-motion";
import Section, { fadeUp } from "./Section.jsx";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import { useFile } from "../hooks/useFile.jsx";
import Icon from "./Icon.jsx";

const STAT_HUES = ["#22D3EE", "#A78BFA", "#FBBF24", "#FB7185", "#A3E635", "#38BDF8"];

export default function About() {
  const { profile, about } = useSiteContent();
  const a = about;
  const showAvailability = a.availability?.enabled !== false;
  const resumeUri = useFile(profile.resumeFile);
  const resumeHref = resumeUri || profile.resumeUrl || "";

  return (
    <Section id="about" eyebrow="about" title="Behind the" accent="pixels">
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
        {/* Bio — spans 2 rows on desktop */}
        <motion.div
          variants={fadeUp}
          style={{ "--hue": "#A78BFA", "--hue-a": "#A78BFA", "--hue-b": "#22D3EE" }}
          className="hue-card ring-hue p-7 md:col-span-2 lg:row-span-2"
        >
          <h3 className="mb-4 font-display text-2xl font-bold text-white">
            {a.greeting} {profile.name} —{" "}
            <span className="serif-accent grad-text">{a.headingAccent}</span>
          </h3>
          <div className="space-y-4 leading-relaxed text-slate-400">
            {(a.paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        {(a.stats || []).length > 0 && (
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-3 gap-3 md:col-span-3 lg:col-span-2 lg:grid-cols-1"
          >
            {a.stats.map((s, i) => {
              const hue = STAT_HUES[i % STAT_HUES.length];
              return (
                <div
                  key={s.label}
                  style={{ "--hue": hue, "--hue-a": hue, "--hue-b": hue }}
                  className="hue-card flex flex-col items-center justify-center p-5 text-center lg:flex-row lg:justify-between lg:px-7 lg:text-left"
                >
                  <span
                    className="grad-text font-display text-3xl font-extrabold"
                    style={{ "--hue-a": hue, "--hue-b": `${hue}CC` }}
                  >
                    {s.value}
                  </span>
                  <span className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500 lg:mt-0">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Availability */}
        {showAvailability && (
          <motion.div
            variants={fadeUp}
            style={{ "--hue": "#10B981", "--hue-a": "#10B981", "--hue-b": "#A3E635" }}
            className="hue-card flex flex-col justify-between p-6 md:col-span-1"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <div className="mt-8">
              <p className="font-display text-lg font-bold text-white">
                {a.availability?.title}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {a.availability?.text}
              </p>
            </div>
          </motion.div>
        )}

        {/* Location */}
        <motion.div
          variants={fadeUp}
          style={{ "--hue": "#22D3EE", "--hue-a": "#22D3EE", "--hue-b": "#38BDF8" }}
          className="hue-card flex flex-col justify-between p-6"
        >
          <Icon name="briefcase" className="h-6 w-6 text-cyan" />
          <div className="mt-8">
            <p className="font-display text-lg font-bold text-white">
              {profile.location}
            </p>
            <p className="mt-1 text-sm text-slate-400">{a.locationNote}</p>
          </div>
        </motion.div>

        {/* Download CV card */}
        {resumeHref && (
          <motion.a
            variants={fadeUp}
            href={resumeHref}
            download={profile.resumeFile?.name || "resume"}
            style={{ "--hue": "#A78BFA", "--hue-a": "#A78BFA", "--hue-b": "#FB7185" }}
            className="hue-card group flex flex-col justify-between p-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet/15 text-violet transition-transform duration-300 group-hover:-translate-y-0.5">
              <Icon name="download" className="h-5 w-5" />
            </span>
            <div className="mt-8">
              <p className="font-display text-lg font-bold text-white">
                Download CV
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400 transition-colors group-hover:text-violet">
                {profile.resumeFile?.name || `Resume — ${resumeHref.startsWith("data:") ? "file" : "PDF"}`}
                <Icon name="arrow" className="h-4 w-4" />
              </p>
            </div>
          </motion.a>
        )}
      </div>
    </Section>
  );
}
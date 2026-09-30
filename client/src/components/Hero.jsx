import { motion } from "framer-motion";
import { SOCIALS } from "../data/constants.js";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";
import { fadeUp, stagger } from "./Section.jsx";

export default function Hero() {
  const { profile } = useSiteContent();

  return (
    <section
      id="home"
      className="grain relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Atmosphere: aurora glows + grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[160px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[8%] top-[20%] h-80 w-80 rounded-full bg-mint/8 blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-[10%] left-[5%] h-72 w-72 rounded-full bg-sage/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0"
      />

      {/* Oversized watermark */}
      <span
        aria-hidden="true"
        className="text-outline pointer-events-none absolute -bottom-10 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-extrabold leading-none opacity-40"
      >
        {(profile.brand || "MD").replace(".", "")}
      </span>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* Live status pill */}
        <motion.a
          href="#contact"
          variants={fadeUp}
          className="glass-card group mb-10 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm text-sage"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {profile.status}
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          {profile.firstName}{" "}
          <span className="serif-accent bg-gradient-to-r from-accent to-mint bg-clip-text pr-2 font-normal text-transparent">
            {profile.name.replace(profile.firstName, "").trim()}
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-lg text-slate-400 md:text-xl"
        >
          <span className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
            Web Developer
          </span>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-sm uppercase tracking-[0.3em] text-accent">
            Video Editor
          </span>
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl leading-relaxed text-slate-400"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#projects" className="btn-primary">
            View My Work
            <Icon name="arrow" className="h-4 w-4" />
          </a>
          <a href="#contact" className="btn-outline">
            Get In Touch
          </a>
          <a
            href={profile.resumeUrl || "/resume.pdf"}
            download
            className="btn-outline"
          >
            Download CV
            <Icon name="download" className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex items-center justify-center gap-5"
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
              className="glass-card flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:text-accent hover:shadow-glow-accent"
            >
              <Icon name={s.icon} className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-slate-500">
        <div className="mx-auto mb-2 h-8 w-px animate-pulse-soft bg-gradient-to-b from-accent to-transparent" />
        scroll
      </div>
    </section>
  );
}

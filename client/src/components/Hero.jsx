import { motion } from "framer-motion";
import { PROFILE, SOCIALS } from "../data/constants.js";
import Icon from "./Icon.jsx";
import { fadeUp, stagger } from "./Section.jsx";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sage/10 blur-[120px]"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        {/* Live status pill */}
        <motion.a
          href="#contact"
          variants={fadeUp}
          className="glass-card group mb-8 inline-flex items-center gap-2 px-4 py-2 text-sm text-sage"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          {`🟢 ${PROFILE.status}`}
          <Icon
            name="arrow"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="text-4xl font-extrabold leading-tight text-white md:text-6xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-accent to-sage bg-clip-text text-transparent">
            {PROFILE.name}
          </span>
          .
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-2xl font-semibold text-slate-400 md:text-3xl"
        >
          <span className="font-mono text-accent">{"> "}</span>
          {PROFILE.role}
        </motion.p>

        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-slate-400">
          {PROFILE.tagline}
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
              className="text-slate-400 transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <Icon name={s.icon} className="h-6 w-6" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-slate-500">
        <div className="mx-auto mb-2 h-8 w-px animate-pulse-soft bg-gradient-to-b from-accent to-transparent" />
        scroll
      </div>
    </section>
  );
}

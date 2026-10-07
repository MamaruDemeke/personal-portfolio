import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import { useFile } from "../hooks/useFile.jsx";
import Icon from "./Icon.jsx";
import { fadeUp, stagger } from "./Section.jsx";

export default function Hero() {
  const { profile, hero, socials } = useSiteContent();
  const roles = hero.roles || [];
  const socialList = socials || [];
  const resumeUri = useFile(profile.resumeFile);
  const resumeHref = resumeUri || profile.resumeUrl || "";

  return (
    <section
      id="home"
      className="grain relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      {/* Atmosphere: coloured aurora glows + grid */}
      <div className="orb -top-48 left-1/2 h-[520px] w-[880px] -translate-x-1/2 animate-drift bg-accent/25" />
      <div className="orb right-[4%] top-[16%] h-80 w-80 animate-drift bg-violet/25 [animation-delay:-7s]" />
      <div className="orb bottom-[6%] left-[4%] h-72 w-72 animate-drift bg-cyan/25 [animation-delay:-14s]" />
      <div
        aria-hidden="true"
        className="grid-lines pointer-events-none absolute inset-0"
      />

      {/* Oversized watermark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap bg-gradient-to-b from-white/12 to-transparent bg-clip-text font-display text-[22vw] font-extrabold leading-none text-transparent opacity-60"
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
        {profile.status && (
          <motion.a
            href="#contact"
            variants={fadeUp}
            className="glass-card group mb-8 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-sm text-sage"
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
        )}

        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          {profile.firstName}{" "}
          <span className="serif-accent bg-gradient-to-r from-accent via-cyan to-violet bg-clip-text pr-2 font-normal text-transparent">
            {profile.name.replace(profile.firstName, "").trim()}
          </span>
        </motion.h1>

        {roles.length > 0 && (
          <motion.p
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-lg text-slate-400 md:text-xl"
          >
            {roles.map((role, i) => {
              const hue = ["#10B981", "#22D3EE", "#A78BFA", "#FBBF24"][i % 4];
              return (
                <span key={role} className="flex items-center gap-3">
                  {i > 0 && <span className="text-slate-600">/</span>}
                  <span
                    className="font-mono text-sm uppercase tracking-[0.3em]"
                    style={{ color: hue }}
                  >
                    {role}
                  </span>
                </span>
              );
            })}
          </motion.p>
        )}

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl leading-relaxed text-slate-400"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          {hero.primaryCta && (
            <a href={hero.primaryHref || "#projects"} className="btn-primary">
              {hero.primaryCta}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          )}
          {hero.secondaryCta && (
            <a href={hero.secondaryHref || "#contact"} className="btn-outline">
              {hero.secondaryCta}
            </a>
          )}
          {hero.showResume && resumeHref && (
            <a
              href={resumeHref}
              download={profile.resumeFile?.name || "resume"}
              className="btn-outline"
            >
              {hero.resumeCta || "Download CV"}
              <Icon name="download" className="h-4 w-4" />
            </a>
          )}
        </motion.div>

        {socialList.length > 0 && (
          <motion.div
            variants={fadeUp}
            className="mt-8 flex items-center justify-center gap-5"
          >
            {socialList.map((s, i) => {
              const hue = [
                "#10B981",
                "#22D3EE",
                "#A78BFA",
                "#FB7185",
                "#FBBF24",
                "#38BDF8",
              ][i % 6];
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href?.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className="glass-card flex h-11 w-11 items-center justify-center rounded-full text-slate-400 transition-all duration-300 hover:-translate-y-1"
                  style={{ "--hue": hue }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = hue;
                    e.currentTarget.style.boxShadow = `0 0 22px ${hue}66`;
                    e.currentTarget.style.borderColor = `${hue}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "";
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  <Icon name={s.icon} className="h-5 w-5" />
                </a>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-mono text-xs uppercase tracking-widest text-slate-500">
        <div className="mx-auto mb-2 h-8 w-px animate-pulse-soft bg-gradient-to-b from-accent to-transparent" />
        scroll
      </div>
    </section>
  );
}
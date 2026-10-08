import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

const LINK_HUES = ["#A3E635", "#22D3EE", "#38BDF8", "#A78BFA", "#FB7185"];

/** Highlights the nav item for whichever top-level section is currently in
    view, so visitors always know where they are on the page. */
function useActiveSection(links) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(String(l.href || "").replace(/^#/, "")))
      .filter(Boolean);
    if (els.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [links.map((l) => l.href).join("|")]);
  return active;
}

export default function Navbar() {
  const { profile, navLinks } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = (navLinks || []).filter((l) => l.visible !== false);
  const active = useActiveSection(links);
  const hueFor = (i) => LINK_HUES[i % LINK_HUES.length];
  const idOf = (l) => String(l.href || "").replace(/^#/, "");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-40 px-3 transition-all duration-300 sm:px-4 ${
        scrolled ? "pb-3 pt-[max(0.625rem,env(safe-area-inset-top))]" : "pb-1 pt-[max(1.25rem,env(safe-area-inset-top))]"
      }`}
    >
      <nav
        className={`flex h-16 w-full items-center justify-between gap-2 rounded-full border pl-2 pr-2 transition-all duration-300 sm:mx-auto sm:max-w-6xl sm:gap-3 sm:pl-6 ${
          scrolled
            ? "border-white/10 bg-obsidian/85 shadow-glass ring-1 ring-white/5 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        {/* Brand */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-2 font-mono text-lg font-bold text-white sm:gap-2.5"
        >
          {profile.logoUrl && (
            <img
              src={profile.logoUrl}
              alt={`${profile.name} logo`}
              className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-white/10 sm:h-14 sm:w-14"
            />
          )}
          <span className="hidden min-w-0 truncate sm:block">
            <span className="text-accent">{"<"}</span>
            {profile.brand}
            <span className="text-cyan">{"/>"}</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden min-w-0 items-center gap-1 md:flex">
          {links.map((l, i) => {
            const hue = hueFor(i);
            const isActive = active === idOf(l);
            return (
              <li key={l.href + l.label} className="shrink-0">
                <a
                  href={l.href}
                  className="relative rounded-full px-3.5 py-2 text-sm transition-colors"
                  style={{
                    color: isActive ? hue : "#cbd5e1",
                    background: isActive ? `${hue}14` : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive && e.currentTarget.style.color === "rgb(203, 213, 225)") e.currentTarget.style.color = hue;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "#cbd5e1";
                  }}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full"
                      style={{ background: hue }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-accent px-2.5 py-1.5 text-xs font-bold text-white ring-1 ring-accent/30 transition-all hover:bg-accent-dark hover:shadow-glow-accent sm:px-4 sm:text-sm"
          >
            Hire Me
          </a>
          {links.length > 0 && (
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-slate-200 transition-colors hover:border-accent/50 hover:text-accent md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-obsidian/95 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-glass ring-1 ring-white/5 backdrop-blur-xl"
          >
            <ul className="space-y-1.5">
              {links.map((l, i) => {
                const hue = hueFor(i);
                const isActive = active === idOf(l);
                return (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[3rem] items-center justify-between rounded-xl border-l-2 px-4 py-3 text-slate-200 transition-colors hover:bg-accent/10"
                      style={{
                        borderColor: isActive ? hue : "transparent",
                        color: isActive ? hue : undefined,
                      }}
                    >
                      <span className="font-mono text-sm">{l.label}</span>
                      {isActive && <Icon name="arrow" className={`h-4 w-4`} />}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-[3rem] items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white ring-1 ring-accent/30 md:hidden"
            >
              Hire Me
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

export default function Navbar() {
  const { profile, navLinks } = useSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const links = (navLinks || []).filter((l) => l.visible !== false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 px-4 transition-all duration-300 ${
        scrolled ? "pt-3" : "pt-5"
      }`}
    >
      <nav
        className={`mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border px-5 transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-obsidian/80 shadow-glass backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#home"
          className="flex items-center gap-2.5 font-mono text-lg font-bold text-white"
        >
          {profile.logoUrl && (
            <img
              src={profile.logoUrl}
              alt={`${profile.name} logo`}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
            />
          )}
          <span>
            <span className="text-accent">{"<"}</span>
            {profile.brand}
            <span className="text-cyan">{"/>"}</span>
          </span>
        </a>

        {/* Desktop */}
        {links.length > 0 && (
          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l, i) => {
              const hue = ["#A3E635", "#22D3EE", "#38BDF8", "#A78BFA", "#FB7185"][
                i % 5
              ];
              return (
                <li key={l.href + l.label}>
                  <a
                    href={l.href}
                    className="nav-link relative text-sm text-slate-300 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full"
                    style={{ color: "#cbd5e1" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = hue;
                      e.currentTarget.style.setProperty("--hue", hue);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#cbd5e1";
                    }}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full bg-gradient-to-r from-lime via-accent to-cyan px-4 py-1.5 text-sm font-semibold text-obsidian transition-all hover:scale-[1.03] hover:shadow-glow-accent md:inline-flex"
          >
            Hire Me
          </a>
          {links.length > 0 && (
            <button
              className="text-slate-200 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-obsidian/95 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-1 p-3">
              {links.map((l, i) => {
                const hue = ["#A3E635", "#22D3EE", "#38BDF8", "#A78BFA", "#FB7185"][
                  i % 5
                ];
                return (
                  <li key={l.href + l.label}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl border-l-2 px-4 py-2.5 text-slate-300 transition-colors hover:bg-surface"
                      style={{ borderColor: `${hue}00` }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = hue;
                        e.currentTarget.style.borderColor = hue;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#cbd5e1";
                        e.currentTarget.style.borderColor = `${hue}00`;
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
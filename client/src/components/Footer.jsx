import { PROFILE, SOCIALS } from "../data/constants.js";
import Icon from "./Icon.jsx";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 sm:flex-row">
        <p className="font-mono text-xs">
          Designed &amp; built by{" "}
          <span className="text-accent">{PROFILE.name}</span> ©{" "}
          {new Date().getFullYear()}
        </p>

        <div className="flex gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="glass-card flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:-translate-y-0.5 hover:text-accent"
            >
              <Icon name={s.icon} className="h-4 w-4" />
            </a>
          ))}
        </div>

        <a
          href="#home"
          className="font-mono text-xs uppercase tracking-widest text-slate-500 transition-colors hover:text-accent"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

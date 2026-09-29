import { PROFILE, SOCIALS } from "../data/constants.js";
import Icon from "./Icon.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-500 sm:flex-row">
        <p className="font-mono">
          Designed &amp; built by{" "}
          <span className="text-accent">{PROFILE.name}</span> ©{" "}
          {new Date().getFullYear()}
        </p>
        <div className="flex gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="hover:text-accent"
            >
              <Icon name={s.icon} className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

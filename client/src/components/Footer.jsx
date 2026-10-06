import { useSiteContent } from "../hooks/useSiteContent.jsx";
import Icon from "./Icon.jsx";

export default function Footer() {
  const { profile, socials } = useSiteContent();
  const socialList = socials || [];

  return (
    <footer className="relative overflow-hidden border-t border-white/5 py-10">
      {/* Multicolour hairline along the top edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #A3E635, #22D3EE, #A78BFA, #FB7185, #FBBF24, transparent)",
          opacity: 0.6,
        }}
      />

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-slate-500 sm:flex-row">
        <p className="font-mono text-xs">
          Designed &amp; built by{" "}
          <span className="grad-text">{profile.name}</span> ©{" "}
          {new Date().getFullYear()}
        </p>

        <div className="flex gap-3">
          {socialList.map((s, i) => {
            const hue = ["#38BDF8", "#A78BFA", "#FB7185", "#FBBF24", "#10B981"][
              i % 5
            ];
            return (
              <a
                key={s.label}
                href={s.href}
                target={s.href?.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={s.label}
                className="hue-card flex h-9 w-9 items-center justify-center rounded-full"
                style={{ "--hue": hue }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = hue;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "";
                }}
              >
                <Icon name={s.icon} className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        <a
          href="#home"
          className="font-mono text-xs uppercase tracking-widest text-slate-500 transition-colors hover:text-lime"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent.jsx";
import TechIcon from "./TechIcon.jsx";

const ITEM_HUES = [
  "#A3E635",
  "#22D3EE",
  "#38BDF8",
  "#A78BFA",
  "#FB7185",
  "#FBBF24",
];

const toItem = (s) =>
  typeof s === "string" ? { name: s, logo: s } : s;

export default function Marquee() {
  const { skills } = useSiteContent();
  const items = (skills || []).flatMap((c) =>
    (c.skills || []).map(toItem).map((s) => s.name)
  );
  const row = items.length ? [...items, ...items] : [];

  if (!row.length) return null;

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/5 bg-surface/40 py-4"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent" />
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((item, i) => {
          const hue = ITEM_HUES[i % ITEM_HUES.length];
          return (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-slate-500"
            >
              <span className="flex items-center gap-2">
                <TechIcon name={item} className="h-4 w-4" color={hue} />
                <span style={{ color: "#94a3b8" }}>{item}</span>
              </span>
              <span style={{ color: `${hue}99` }}>✦</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

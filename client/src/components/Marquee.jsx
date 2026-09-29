import { motion } from "framer-motion";
import { PROFILE, SKILL_CATEGORIES } from "../data/constants.js";

const ITEMS = SKILL_CATEGORIES.flatMap((c) => c.skills);

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/5 bg-surface/40 py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-obsidian to-transparent" />
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-slate-500"
          >
            {item}
            <span className="text-accent/60">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
